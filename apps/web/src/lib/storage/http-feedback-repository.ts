import type { FeedbackPayload, FeedbackResult } from '@/types/feedback'
import type { FeedbackRepository } from './repositories'

/** Phase 2: POST /v1/feedback на Go API → GitHub Issues API. */
export class HttpFeedbackRepository implements FeedbackRepository {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async submit(payload: FeedbackPayload): Promise<FeedbackResult> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Feedback API error: ${res.status}`)
    }

    const data = (await res.json()) as { id: string; issueUrl: string; agentQueued?: boolean }
    return { id: data.id, issueUrl: data.issueUrl, via: 'api', agentQueued: data.agentQueued }
  }
}
