import { cookies } from 'next/headers';
import {
  createRouteHandlerClient,
  createServerActionClient,
  createServerComponentClient
} from '@supabase/auth-helpers-nextjs';

export function getSupabaseServerClient() {
  return createServerComponentClient({ cookies });
}

export function getSupabaseServerActionClient() {
  return createServerActionClient({ cookies });
}

export function getSupabaseRouteHandlerClient() {
  return createRouteHandlerClient({ cookies });
}