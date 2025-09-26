export type StopFormValue = {
  id: string; // react-hook-form key
  local_id: string;
  stop_id?: string;
  name: string;
  lat: number;
  lng: number;
  ward?: string | null;
  name_aliases: string[];
};

export type FareFormValue = {
  id?: string;
  from_stop_ref: string;
  to_stop_ref: string;
  passenger_type: string;
  price_tzs: number;
  note?: string | null;
};

export type RouteFormValues = {
  display_name: string;
  slug: string;
  color: string;
  corridors: string[];
  operator_ids: string[];
  est_buses: number | null;
  hours: string | null;
  notes: string | null;
  status: 'draft' | 'in_review' | 'published';
  origin_terminal_id: string | null;
  destination_terminal_id: string | null;
  review_notes: string | null;
  stops: StopFormValue[];
  fares: FareFormValue[];
};

export type AttachmentDraft = {
  id?: string;
  file_path: string;
  kind: string;
  caption: string | null;
  publicUrl?: string;
  status: 'persisted' | 'new';
  markedForDeletion?: boolean;
};
