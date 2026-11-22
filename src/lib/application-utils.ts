import { isUuid } from './job-utils.ts'

export type ParsedApplicationInput =
  | { ok: true; jobId: string; coverLetter: string | null }
  | { ok: false; message: string }

const maxCoverLetterLength = 5000

export function parseApplicationInput(
  jobIdValue: unknown,
  coverLetterValue: unknown,
): ParsedApplicationInput {
  if (typeof jobIdValue !== 'string' || !isUuid(jobIdValue)) {
    return { ok: false, message: 'This job link is not valid.' }
  }

  if (coverLetterValue !== null && typeof coverLetterValue !== 'string') {
    return { ok: false, message: 'The cover letter is not valid.' }
  }

  const rawCoverLetter = coverLetterValue ?? ''
  if (rawCoverLetter.length > maxCoverLetterLength) {
    return { ok: false, message: 'Keep your cover letter to 5,000 characters or fewer.' }
  }

  return {
    ok: true,
    jobId: jobIdValue,
    coverLetter: rawCoverLetter.trim() || null,
  }
}
