import { answerLocal } from '@/lib/chat/answer-local'
import type { ChatPayload, ChatResult } from '@/types/chat'
import type { ChatRepository } from './repositories'

/** Offline / GitHub Pages: rule-based ответы без LLM. */
export class LocalChatRepository implements ChatRepository {
  async send(payload: ChatPayload): Promise<ChatResult> {
    const reply = answerLocal(payload.message, payload.context)
    return { reply, via: 'local' }
  }
}
