export interface Post {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImageUrl?: string | null
  tags: string[]
  category?: string | null
  status: 'draft' | 'published'
  publishedAt?: Date | null
  readingTimeMinutes: number
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface Photo {
  id: string
  title?: string | null
  imageUrl: string
  album?: string | null
  description?: string | null
  takenAt?: Date | null
  linkUrl?: string | null
  createdAt: Date
}

export interface About {
  id: string
  displayName: string
  headline: string
  bioMarkdown: string
  links: SocialLink[]
  experience?: Experience[] | null
  skills?: string[] | null
  updatedAt: Date
}

export interface SocialLink {
  type: 'linkedin' | 'github' | 'facebook' | 'instagram' | 'email' | 'website'
  url: string
  label?: string
}

export interface Experience {
  title: string
  organization: string
  startDate: string
  endDate?: string
  description?: string
}
