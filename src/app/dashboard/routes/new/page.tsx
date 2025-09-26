import type { Metadata } from "next";
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { RouteEditor } from '@/components/RouteEditor';

export const metadata: Metadata = {
  title: 'Create Route · DaRoutes Wiki',
  description: 'Document a new Dar es Salaam bus or BRT route with stops, fares, and media.',
  openGraph: {
    title: 'Create Route · DaRoutes Wiki',
    description: 'Document a new Dar es Salaam bus or BRT route with stops, fares, and media.',
    url: '/dashboard/routes/new',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Create a new DaRoutes entry'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Route · DaRoutes Wiki',
    description: 'Document a new Dar es Salaam bus or BRT route with stops, fares, and media.',
    images: ['/opengraph-image']
  }
};

export default async function NewRoutePage() {
  const supabase = getSupabaseServerClient();
  const { data: operators } = await supabase
    .from('operators')
    .select('id,name')
    .order('name');
  const { data: terminals } = await supabase
    .from('terminals')
    .select('id,name,slug,status')
    .order('name');

  return (
    <div className="space-y-6">
      <RouteEditor
        mode="create"
        route={null}
        operators={operators ?? []}
        terminals={terminals ?? []}
        initialStops={[]}
        initialFares={[]}
        initialAttachments={[]}
      />
    </div>
  );
}
