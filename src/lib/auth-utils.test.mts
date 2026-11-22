import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildCandidateSignupMetadata, parseSignupInput } from './auth-utils.ts'

describe('parseSignupInput', () => {
  it('trims the name and normalizes the email while preserving the password', () => {
    assert.deepEqual(parseSignupInput('  Joshua Banda  ', ' JOSHUA@example.com ', ' pass word '), {
      ok: true,
      fullName: 'Joshua Banda',
      email: 'joshua@example.com',
      password: ' pass word ',
    })
  })

  it('rejects missing, malformed, and oversized values', () => {
    assert.equal(parseSignupInput(null, 'joshua@example.com', 'password').ok, false)
    assert.equal(parseSignupInput('Joshua', 'not-an-email', 'password').ok, false)
    assert.equal(parseSignupInput('x'.repeat(121), 'joshua@example.com', 'password').ok, false)
    assert.equal(parseSignupInput('Joshua', 'joshua@example.com', 'x'.repeat(129)).ok, false)
  })
})

describe('buildCandidateSignupMetadata', () => {
  it('always sets the account role to candidate', () => {
    assert.deepEqual(buildCandidateSignupMetadata('Joshua Banda'), {
      full_name: 'Joshua Banda',
      role: 'candidate',
    })
  })
})
