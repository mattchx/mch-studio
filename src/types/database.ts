export type ContentType = 'social' | 'blog' | 'report' | 'gbp_post' | 'newsletter' | 'site_update'
export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
export type JobType = 'monthly_social' | 'monthly_blog' | 'monthly_report' | 'monthly_gbp' | 'single'
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'
export type Brand = 'mch_projects' | 'mch_labs'

export interface Client {
  id: string
  slug: string
  business_name: string
  category: string | null
  brand: Brand
  created_at: string
  updated_at: string
}

export interface ContentItem {
  id: string
  client_id: string
  content_type: ContentType
  status: ContentStatus
  title: string
  body: string | null
  image_url: string | null
  image_prompt: string | null
  metadata: Record<string, unknown>
  rejection_note: string | null
  due_date: string | null
  generated_at: string
  reviewed_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  // joined
  client?: Client
}

export interface GenerationJob {
  id: string
  client_id: string
  job_type: JobType
  status: JobStatus
  config: Record<string, unknown>
  error_message: string | null
  items_created: number
  created_at: string
  completed_at: string | null
}

export interface ClientProfile {
  id: string
  client_id: string
  brand_voice: string | null
  target_audience: string | null
  key_services: string[]
  location_context: string | null
  content_guidelines: string | null
  social_platforms: string[]
  created_at: string
  updated_at: string
}
