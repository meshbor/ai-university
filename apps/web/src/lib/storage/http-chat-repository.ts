import type { ChatPayload, ChatResult } from '@/types/chat'
import type { ChatRepository } from './repositories'

/** Phase 3: POST /v1/chat — local FAQ или OpenAI через backend. */
export class HttpChatRepository implements ChatRepository {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async send(payload: ChatPayload): Promise<ChatResult> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: payload.message,
        history: payload.history.map((m) => ({ role: m.role, content: m.content })),
        context: payload.context,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Chat API error: ${res.status}`)
    }

    const data = (await res.json()) as { reply: string; via?: string }
    return {
      reply: data.reply,
      via: data.via === 'openai' ? 'api' : 'local',
    }
  }
}
