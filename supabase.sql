-- Enable PostGIS (and pgcrypto for UUID helpers)
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- Profile (create early so the role helper works)
create table if not exists public.profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default timezone('utc', now())
);

-- Roles helper
create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from profile
  where user_id = auth.uid()
$$;

-- Operators
create table public.operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Stops
create table public.stops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_aliases text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  geom geography(Point, 4326),
  ward text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.sync_stop_geom()
returns trigger
language plpgsql
security definer as $$
begin
  new.geom := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$;

create trigger stops_geom_trigger
before insert or update on public.stops
for each row execute function public.sync_stop_geom();

-- Routes
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  color text not null default '#1e40af',
  start_stop_id uuid references public.stops(id),
  end_stop_id uuid references public.stops(id),
  corridors text[] not null default '{}',
  operator_ids uuid[] not null default '{}',
  est_buses integer,
  hours text,
  notes text,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_route_defaults()
returns trigger
language plpgsql
security definer as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
  end if;
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger routes_timestamps
before insert or update on public.routes
for each row execute function public.set_route_defaults();

-- Route stops
create table public.route_stops (
  route_id uuid not null references public.routes(id) on delete cascade,
  stop_id uuid not null references public.stops(id) on delete cascade,
  seq integer not null,
  primary key(route_id, seq)
);

-- Fares
create table public.fares (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  from_stop_id uuid references public.stops(id) on delete set null,
  to_stop_id uuid references public.stops(id) on delete set null,
  passenger_type text not null,
  price_tzs numeric(12,2) not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Route variants
create table public.route_variants (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Attachments
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  file_path text not null,
  kind text not null default 'ticket',
  caption text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_attachment_defaults()
returns trigger
language plpgsql
security definer as $$
begin
  if new.uploaded_by is null then
    new.uploaded_by := auth.uid();
  end if;
  return new;
end;
$$;

create trigger attachments_defaults
before insert on public.attachments
for each row execute function public.set_attachment_defaults();

-- Audit log
create table public.audit_log (
  id bigint generated always as identity primary key,
  entity text not null,
  entity_id text not null,
  action text not null,
  diff jsonb not null,
  actor uuid,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.write_audit()
returns trigger
language plpgsql
security definer as $$
declare
  payload jsonb;
  key text;
begin
  payload := case
    when tg_op = 'DELETE' then to_jsonb(old)
    else to_jsonb(new)
  end;

  key := coalesce(
    payload ->> 'id',
    (payload ->> 'route_id') || ':' || (payload ->> 'seq'),
    gen_random_uuid()::text
  );

  insert into public.audit_log(entity, entity_id, action, diff, actor)
  values (tg_table_name, key, tg_op, payload, auth.uid());

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;


-- Attach audit triggers
create trigger audit_routes
after insert or update or delete on public.routes
for each row execute function public.write_audit();

create trigger audit_stops
after insert or update or delete on public.stops
for each row execute function public.write_audit();

create trigger audit_route_stops
after insert or update or delete on public.route_stops
for each row execute function public.write_audit();

create trigger audit_fares
after insert or update or delete on public.fares
for each row execute function public.write_audit();

create trigger audit_route_variants
after insert or update or delete on public.route_variants
for each row execute function public.write_audit();

create trigger audit_attachments
after insert or update or delete on public.attachments
for each row execute function public.write_audit();

-- RLS
alter table public.operators enable row level security;
alter table public.stops enable row level security;
alter table public.routes enable row level security;
alter table public.route_stops enable row level security;
alter table public.fares enable row level security;
alter table public.route_variants enable row level security;
alter table public.attachments enable row level security;
alter table public.audit_log enable row level security;
alter table public.profile enable row level security;

-- Operators policies
create policy operators_public_read
on public.operators for select using (true);

create policy operators_write_admins
on public.operators for all using (
  public.current_profile_role() in ('admin','editor')
) with check (
  public.current_profile_role() in ('admin','editor')
);

-- Stops policies
create policy stops_public_read
on public.stops for select using (true);

create policy stops_write_admins
on public.stops for all using (
  public.current_profile_role() in ('admin','editor')
) with check (
  public.current_profile_role() in ('admin','editor')
);

-- Routes policies
create policy routes_public_read
on public.routes for select using (
  is_published = true
  or auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

create policy routes_write_admins
on public.routes for all using (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
) with check (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

-- Route stops policies
create policy routestops_public_read
on public.route_stops for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.is_published = true
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy routestops_write_admins
on public.route_stops for all using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
) with check (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

-- Fares policies
create policy fares_public_read
on public.fares for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.is_published = true
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy fares_write_admins
on public.fares for all using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
) with check (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

-- Route variants policies
create policy variants_public_read
on public.route_variants for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.is_published = true
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy variants_write_admins
on public.route_variants for all using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
) with check (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

-- Attachments policies
create policy attachments_public_read
on public.attachments for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.is_published = true
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy attachments_write_admins
on public.attachments for all using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
) with check (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

-- Audit log policies (readable only by admins)
create policy audit_select_admins
on public.audit_log for select using (
  public.current_profile_role() = 'admin'
);

create policy audit_no_direct_writes
on public.audit_log for insert
with check (false);

-- Profile policies
create policy profile_self_read
on public.profile for select using (auth.uid() = user_id);

create policy profile_admin_read
on public.profile for select using (public.current_profile_role() = 'admin');

create policy profile_self_insert
on public.profile for insert with check (auth.uid() = user_id);

create policy profile_admin_write
on public.profile for all using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

-- Seed data
insert into public.operators (id, name, notes)
values ('11111111-1111-1111-1111-111111111111', 'Dar City Buses', 'Flagship BRT operator.')
on conflict (id) do nothing;

insert into public.stops (id, name, lat, lng, ward, created_by)
values
  ('22222222-2222-2222-2222-222222222222', 'Kivukoni Ferry', -6.8225, 39.2918, 'Ilala', null),
  ('33333333-3333-3333-3333-333333333333', 'Posta', -6.8158, 39.2891, 'Ilala', null),
  ('44444444-4444-4444-4444-444444444444', 'UDSM Main Gate', -6.7706, 39.2391, 'Kinondoni', null)
on conflict (id) do nothing;

insert into public.routes (
  id, slug, display_name, color, start_stop_id, end_stop_id,
  corridors, operator_ids, est_buses, hours, notes,
  is_published, created_by
) values (
  '55555555-5555-5555-5555-555555555555',
  'kivukoni-to-udsm',
  'Kivukoni – UDSM Loop',
  '#0ea5e9',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  '{BRT,UDSM}',
  '{11111111-1111-1111-1111-111111111111}',
  12,
  '05:30 – 22:00',
  'Core loop serving CBD to campus.',
  true,
  null
) on conflict (id) do nothing;

insert into public.route_stops (route_id, stop_id, seq)
values
 ('55555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222',1),
 ('55555555-5555-5555-5555-555555555555','33333333-3333-3333-3333-333333333333',2),
 ('55555555-5555-5555-5555-555555555555','44444444-4444-4444-4444-444444444444',3)
on conflict do nothing;

insert into public.fares (id, route_id, from_stop_id, to_stop_id, passenger_type, price_tzs, note)
values
 ('66666666-6666-6666-6666-666666666666','55555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222','44444444-4444-4444-4444-444444444444','adult', 1200, 'Standard fare'),
 ('77777777-7777-7777-7777-777777777777','55555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222','44444444-4444-4444-4444-444444444444','student', 800, 'Discounted with ID')
on conflict (id) do nothing;

insert into public.route_variants (id, route_id, name, active, notes)
values ('88888888-8888-8888-8888-888888888888','55555555-5555-5555-5555-555555555555','Express AM', true, 'Limited stops AM peak')
on conflict (id) do nothing;

insert into public.attachments (id, route_id, file_path, kind, caption, uploaded_by)
values ('99999999-9999-9999-9999-999999999999','55555555-5555-5555-5555-555555555555','route-media/kivukoni-ticket.jpg','ticket','Sample ticket stub', null)
on conflict (id) do nothing;
