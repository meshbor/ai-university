import { GitHubIssueFeedbackRepository } from './github-issue-feedback-repository'
import { HttpFeedbackRepository } from './http-feedback-repository'
import type { FeedbackRepository } from './repositories'

function resolveApiBaseUrl(): string | null {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function createFeedbackRepository(): FeedbackRepository {
  const apiBase = resolveApiBaseUrl()
  if (apiBase) return new HttpFeedbackRepository(apiBase)
  return new GitHubIssueFeedbackRepository()
}

export function isApiFeedbackAvailable(): boolean {
  return resolveApiBaseUrl() !== null
}

export const feedbackRepository = createFeedbackRepository()
