export type WorkflowStatus = 'draft' | 'in_review' | 'published';

export const WORKFLOW_STATUS_OPTIONS: { value: WorkflowStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' }
];

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published'
};
