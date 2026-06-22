import type { FeedbackContext } from '@/types/feedback'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

export interface ChatPayload {
  message: string
  history: ChatMessage[]
  context: FeedbackContext | null
}

export interface ChatResult {
  reply: string
  via: 'local' | 'api'
}
