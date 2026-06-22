import {
  feedbackIssueBody,
  feedbackIssueTitle,
  githubNewIssueUrl,
} from '@/lib/feedback/format-issue-body'
import type { FeedbackPayload, FeedbackResult } from '@/types/feedback'
import type { FeedbackRepository } from './repositories'

/** Phase 1: открывает prefilled GitHub Issue (работает на GitHub Pages без backend). */
export class GitHubIssueFeedbackRepository implements FeedbackRepository {
  async submit(payload: FeedbackPayload): Promise<FeedbackResult> {
    const title = feedbackIssueTitle(payload.category, payload.message)
    const body = feedbackIssueBody(payload)
    const labels = payload.requestAgent ? ['feedback', 'agent'] : ['feedback']
    const issueUrl = githubNewIssueUrl(title, body, labels)

    window.open(issueUrl, '_blank', 'noopener,noreferrer')

    return {
      id: `draft-${Date.now()}`,
      issueUrl,
      via: 'github-draft',
    }
  }
}
