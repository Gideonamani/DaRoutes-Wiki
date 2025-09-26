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
  slug text not null unique,
  name text not null,
  description text,
  name_aliases text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  geom geography(Point, 4326),
  ward text,
  status text not null default 'draft' check (status in ('draft','in_review','published')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create or replace function public.set_stop_defaults()
returns trigger
language plpgsql
security definer as 
declare
  actor uuid := auth.uid();
begin
  new.geom := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;

  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := actor;
    end if;
  end if;

  if actor is not null then
    new.updated_by := actor;
  elsif tg_op = 'UPDATE' then
    new.updated_by := coalesce(new.updated_by, old.updated_by);
  end if;

  new.updated_at := timezone('utc', now());

  if new.status = 'published' then
    if tg_op = 'INSERT' then
      new.published_at := coalesce(new.published_at, timezone('utc', now()));
    elsif tg_op = 'UPDATE' then
      if coalesce(old.status, '') <> 'published' then
        new.published_at := timezone('utc', now());
      else
        new.published_at := coalesce(new.published_at, old.published_at);
      end if;
    end if;
  else
    new.published_at := null;
  end if;

  return new;
end;
;

create trigger stops_defaults
before insert or update on public.stops
for each row execute function public.set_stop_defaults();

-- Terminals
create table public.terminals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  lat double precision,
  lng double precision,
  geom geography(Point, 4326),
  ward text,
  amenities jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','in_review','published')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create or replace function public.set_terminal_defaults()
returns trigger
language plpgsql
security definer as 
declare
  actor uuid := auth.uid();
begin
  if new.lat is not null and new.lng is not null then
    new.geom := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  end if;

  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := actor;
    end if;
  end if;

  if actor is not null then
    new.updated_by := actor;
  elsif tg_op = 'UPDATE' then
    new.updated_by := coalesce(new.updated_by, old.updated_by);
  end if;

  new.updated_at := timezone('utc', now());

  if new.status = 'published' then
    if tg_op = 'INSERT' then
      new.published_at := coalesce(new.published_at, timezone('utc', now()));
    elsif tg_op = 'UPDATE' then
      if coalesce(old.status, '') <> 'published' then
        new.published_at := timezone('utc', now());
      else
        new.published_at := coalesce(new.published_at, old.published_at);
      end if;
    end if;
  else
    new.published_at := null;
  end if;

  return new;
end;
;

create trigger terminals_defaults
before insert or update on public.terminals
for each row execute function public.set_terminal_defaults();


-- Routes
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  color text not null default '#1e40af',
  start_stop_id uuid references public.stops(id),
  end_stop_id uuid references public.stops(id),
  origin_terminal_id uuid references public.terminals(id),
  destination_terminal_id uuid references public.terminals(id),
  corridors text[] not null default '{}',
  operator_ids uuid[] not null default '{}',
  est_buses integer,
  hours text,
  notes text,
  status text not null default 'draft' check (status in ('draft','in_review','published')),
  review_notes text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create or replace function public.set_route_defaults()
returns trigger
language plpgsql
security definer as 
declare
  actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := actor;
    end if;
  end if;

  if actor is not null then
    new.updated_by := actor;
  elsif tg_op = 'UPDATE' then
    new.updated_by := coalesce(new.updated_by, old.updated_by);
  end if;

  new.updated_at := timezone('utc', now());

  if new.status = 'published' then
    if tg_op = 'INSERT' then
      new.published_at := coalesce(new.published_at, timezone('utc', now()));
    elsif tg_op = 'UPDATE' then
      if coalesce(old.status, '') <> 'published' then
        new.published_at := timezone('utc', now());
      else
        new.published_at := coalesce(new.published_at, old.published_at);
      end if;
    end if;
  else
    new.published_at := null;
  end if;

  return new;
end;
;

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

-- Route terminals
create table public.route_terminals (
  route_id uuid not null references public.routes(id) on delete cascade,
  terminal_id uuid not null references public.terminals(id) on delete cascade,
  role text not null check (role in ('origin','terminus','through')),
  notes text,
  primary key (route_id, terminal_id, role)
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

-- Content revisions
create table public.content_revisions (
  id bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('route','stop','terminal')),
  entity_id uuid not null,
  version integer not null,
  diff jsonb not null default '{}'::jsonb,
  summary text,
  actor uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (entity_type, entity_id, version)
);

create index content_revisions_entity_idx
on public.content_revisions (entity_type, entity_id, version desc);

-- Workflow events
create table public.workflow_events (
  id bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('route','stop','terminal')),
  entity_id uuid not null,
  from_status text,
  to_status text not null,
  note text,
  actor uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index workflow_events_entity_idx
on public.workflow_events (entity_type, entity_id, created_at desc);

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

create trigger audit_terminals
after insert or update or delete on public.terminals
for each row execute function public.write_audit();

create trigger audit_stops
after insert or update or delete on public.stops
for each row execute function public.write_audit();

create trigger audit_route_stops
after insert or update or delete on public.route_stops
for each row execute function public.write_audit();

create trigger audit_route_terminals
after insert or update or delete on public.route_terminals
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

create trigger audit_content_revisions
after insert or update or delete on public.content_revisions
for each row execute function public.write_audit();

create trigger audit_workflow_events
after insert or update or delete on public.workflow_events
for each row execute function public.write_audit();

-- RLS
-- RLS
alter table public.operators enable row level security;
alter table public.stops enable row level security;
alter table public.routes enable row level security;
alter table public.terminals enable row level security;
alter table public.route_stops enable row level security;
alter table public.route_terminals enable row level security;
alter table public.fares enable row level security;
alter table public.route_variants enable row level security;
alter table public.attachments enable row level security;
alter table public.content_revisions enable row level security;
alter table public.workflow_events enable row level security;
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
on public.stops for select using (
  status = 'published'
  or auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

create policy stops_contributor_write
on public.stops for all using (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
) with check (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

-- Terminals policies
create policy terminals_public_read
on public.terminals for select using (
  status = 'published'
  or auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

create policy terminals_contributor_write
on public.terminals for all using (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
) with check (
  auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

-- Routes policies
create policy routes_public_read
on public.routes for select using (
  status = 'published'
  or auth.uid() = created_by
  or public.current_profile_role() in ('admin','editor')
);

create policy routes_contributor_write
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
      and (r.status = 'published'
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy routestops_contributor_write
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

-- Route terminals policies
create policy routeterminals_public_read
on public.route_terminals for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.status = 'published'
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
  or exists (
    select 1 from public.terminals t
    where t.id = terminal_id
      and (t.status = 'published'
           or auth.uid() = t.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy routeterminals_contributor_write
on public.route_terminals for all using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
  or exists (
    select 1 from public.terminals t
    where t.id = terminal_id
      and (auth.uid() = t.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
) with check (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
  or exists (
    select 1 from public.terminals t
    where t.id = terminal_id
      and (auth.uid() = t.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

-- Fares policies
create policy fares_public_read
on public.fares for select using (
  exists (
    select 1 from public.routes r
    where r.id = route_id
      and (r.status = 'published'
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy fares_contributor_write
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
      and (r.status = 'published'
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy variants_contributor_write
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
      and (r.status = 'published'
           or auth.uid() = r.created_by
           or public.current_profile_role() in ('admin','editor'))
  )
);

create policy attachments_contributor_write
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

-- Content revisions policies
create policy revisions_editor_read
on public.content_revisions for select using (
  public.current_profile_role() in ('admin','editor')
);

create policy revisions_editor_write
on public.content_revisions for all using (
  public.current_profile_role() in ('admin','editor')
) with check (
  public.current_profile_role() in ('admin','editor')
);

-- Workflow events policies
create policy workflow_events_editor_read
on public.workflow_events for select using (
  public.current_profile_role() in ('admin','editor')
);

create policy workflow_events_editor_write
on public.workflow_events for all using (
  public.current_profile_role() in ('admin','editor')
) with check (
  public.current_profile_role() in ('admin','editor')
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

insert into public.terminals (id, slug, name, description, lat, lng, ward, amenities, status, created_by)
values
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'kivukoni-terminal', 'Kivukoni Terminal', 'Waterfront hub linking ferry services with daladala routes.', -6.8226, 39.2921, 'Ilala', '["ferry","restrooms","ticketing"]'::jsonb, 'published', null),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'udsm-terminal', 'UDSM Terminal', 'Campus-side terminus serving the University of Dar es Salaam.', -6.7704, 39.2389, 'Kinondoni', '["shelter","ticketing"]'::jsonb, 'published', null)
on conflict (id) do nothing;

insert into public.stops (id, slug, name, description, lat, lng, ward, status, created_by)
values
  ('22222222-2222-2222-2222-222222222222', 'kivukoni-ferry-stop', 'Kivukoni Ferry', 'Ferry boarding point on the waterfront.', -6.8225, 39.2918, 'Ilala', 'published', null),
  ('33333333-3333-3333-3333-333333333333', 'posta-stop', 'Posta', 'Historic central business district stop.', -6.8158, 39.2891, 'Ilala', 'published', null),
  ('44444444-4444-4444-4444-444444444444', 'udsm-main-gate-stop', 'UDSM Main Gate', 'Primary entrance stop for the university.', -6.7706, 39.2391, 'Kinondoni', 'published', null)
on conflict (id) do nothing;

insert into public.routes (
  id, slug, display_name, color, start_stop_id, end_stop_id,
  origin_terminal_id, destination_terminal_id,
  corridors, operator_ids, est_buses, hours, notes,
  status, created_by
) values (
  '55555555-5555-5555-5555-555555555555',
  'kivukoni-to-udsm',
  'Kivukoni - UDSM Loop',
  '#0ea5e9',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  'aaaa1111-aaaa-1111-aaaa-111111111111',
  'bbbb2222-bbbb-2222-bbbb-222222222222',
  '{BRT,UDSM}',
  '{11111111-1111-1111-1111-111111111111}',
  12,
  '05:30 - 22:00',
  'Core loop serving CBD to campus.',
  'published',
  null
) on conflict (id) do nothing;


insert into public.route_terminals (route_id, terminal_id, role, notes)
values
 ('55555555-5555-5555-5555-555555555555','aaaa1111-aaaa-1111-aaaa-111111111111','origin','Waterfront departure point.'),
 ('55555555-5555-5555-5555-555555555555','bbbb2222-bbbb-2222-bbbb-222222222222','terminus','Campus-bound terminus.')
on conflict (route_id, terminal_id, role) do nothing;

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
