import { HttpChatRepository } from './http-chat-repository'
import { LocalChatRepository } from './local-chat-repository'
import type { ChatRepository } from './repositories'

function resolveApiBaseUrl(): string | null {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function createChatRepository(): ChatRepository {
  const apiBase = resolveApiBaseUrl()
  if (apiBase) return new HttpChatRepository(apiBase)
  return new LocalChatRepository()
}

export const chatRepository = createChatRepository()
