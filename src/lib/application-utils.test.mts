import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseApplicationInput } from './application-utils.ts'

const jobId = '123e4567-e89b-12d3-a456-426614174000'

describe('parseApplicationInput', () => {
  it('accepts a valid job and trims an optional cover letter', () => {
    assert.deepEqual(parseApplicationInput(jobId, '  I am interested.  '), {
      ok: true,
      jobId,
      coverLetter: 'I am interested.',
    })
  })

  it('allows an empty optional cover letter', () => {
    assert.deepEqual(parseApplicationInput(jobId, '   '), {
      ok: true,
      jobId,
      coverLetter: null,
    })
  })

  it('rejects malformed job IDs and oversized cover letters', () => {
    assert.equal(parseApplicationInput('bad-id', '').ok, false)
    assert.equal(parseApplicationInput(jobId, 'x'.repeat(5001)).ok, false)
  })
})
