import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { RouteEditor } from '@/components/RouteEditor';

export default async function NewRoutePage() {
  const supabase = getSupabaseServerClient();
  const { data: operators } = await supabase
    .from('operators')
    .select('id,name')
    .order('name');

  return (
    <div className="space-y-6">
      <RouteEditor
        mode="create"
        route={null}
        operators={operators ?? []}
        initialStops={[]}
        initialFares={[]}
        initialAttachments={[]}
      />
    </div>
  );
}
