import { cookies, headers } from 'next/headers';
import {
  createRouteHandlerClient,
  createServerActionClient,
  createServerComponentClient
} from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function getSupabaseServerClient(): SupabaseClient<Database> {
  return createServerComponentClient<Database>({ cookies });
}

export function getSupabaseServerActionClient(): SupabaseClient<Database> {
  return createServerActionClient<Database>({ cookies });
}

export function getSupabaseRouteHandlerClient(): SupabaseClient<Database> {
  return createRouteHandlerClient<Database>({ cookies, headers });
}
