export type TrackSort =
  | 'new'
  | 'trending'
  | 'most_downloaded'
  | 'price_low_to_high'
  | 'price_high_to_low';

export type TrackStatus = 'draft' | 'published' | 'archived';
export type TrackVisibility = 'public' | 'private' | 'unlisted';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type CertificationStatus =
  | 'Draft'
  | 'Pending'
  | 'Certified'
  | 'Rejected'
  | 'Expired';

export type TrackListQuery = {
  q?: string;
  mood?: string[];
  genre?: string[];
  useCase?: string[];
  vocalType?: string[];
  language?: string[];
  energyLevel?: string[];
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  minBpm?: number;
  maxBpm?: number;
  sort?: TrackSort;
  page?: number;
  pageSize?: number;
};

export type TrackItem = {
  id: string;
  asset_id: string;
  title: string;
  artist_name: string;
  composer: string;
  publisher: string;
  description: string;
  release_date: string;
  cover_image_url: string;
  file_url: string | null;
  file_type: 'mp3' | 'wav';
  bitrate: number;
  sample_rate: number;
  duration: number;
  bpm: number;
  key: string;
  file_size_mb: number;
  mood: string[];
  genre: string[];
  energy_level: string;
  use_case: string[];
  vocal_type: 'Vocal' | 'Instrumental';
  language: string;
  theme: string[];
  rights_holder: string;
  ownership_type: 'master' | 'publishing';
  copyright_status: 'registered' | 'unregistered';
  licensing_available: boolean;
  commercial_allowed: boolean;
  allowed_platforms: string[];
  territory: string;
  expiration: string | null;
  upload_date: string;
  uploaded_by: string;
  asset_status: 'active' | 'disabled';
  verification_status: VerificationStatus;
  preview_url: string;
  preview_duration: number;
  price: number;
  currency: 'USD';
  license_type: 'Standard' | 'Extended' | 'Exclusive';
  trending_score: number;
  download_count: number;
  monetization_allowed: boolean;
  commercial_usage_allowed: boolean;
  sponsor_usage_allowed: boolean;
  ads_usage_allowed: boolean;
  personal_usage_allowed: boolean;
  youtube_allowed: boolean;
  youtube_shorts_allowed: boolean;
  youtube_long_form_allowed: boolean;
  platform_scope_note: string;
  certification_id: string;
  certification_status: CertificationStatus;
  certification_scope: string;
  content_id_safe_declaration: boolean;
  certified_by: string;
  certified_at: string;
  certificate_valid_from: string;
  certificate_valid_until: string | null;
  verification_id: string;
  reviewed_by_admin_id: string;
  reviewed_at: string;
  rejection_reason: string | null;
  admin_note: string;
  status: TrackStatus;
  visibility: TrackVisibility;
  created_at: string;
  updated_at: string;
  published_at: string;
  archive_status: boolean;
  deleted_at: string | null;
};

export type CreateTrackInput = Omit<
  TrackItem,
  | 'id'
  | 'asset_id'
  | 'upload_date'
  | 'uploaded_by'
  | 'created_at'
  | 'updated_at'
  | 'published_at'
  | 'preview_duration'
  | 'trending_score'
  | 'download_count'
  | 'verification_id'
  | 'reviewed_by_admin_id'
  | 'reviewed_at'
  | 'admin_note'
  | 'rejection_reason'
>;
