export type FeedbackCategory = 'bug' | 'ui' | 'content' | 'feature'

export interface FeedbackViewport {
  w: number
  h: number
}

export interface FeedbackProfileSummary {
  name: string
  hero: string
  theme: string
}

export interface FeedbackStatsSummary {
  level: number
  doneLessons: number
  xp: number
  streak: number
}

export interface FeedbackContext {
  route: string
  themeId: string
  activeTab: string
  viewport: FeedbackViewport
  profile: FeedbackProfileSummary | null
  stats: FeedbackStatsSummary
  url: string
  userAgent: string
  appVersion: string
}

export interface FeedbackPayload {
  message: string
  category: FeedbackCategory
  context: FeedbackContext | null
  requestAgent?: boolean
}

export interface FeedbackResult {
  id: string
  issueUrl: string
  via: 'github-draft' | 'api'
  agentQueued?: boolean
}
