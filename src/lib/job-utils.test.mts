import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isUuid, relatedName } from './job-utils.ts'

describe('isUuid', () => {
  it('accepts a UUID', () => {
    assert.equal(isUuid('123e4567-e89b-12d3-a456-426614174000'), true)
  })

  it('rejects malformed IDs', () => {
    assert.equal(isUuid('not-a-uuid'), false)
    assert.equal(isUuid(''), false)
  })
})

describe('relatedName', () => {
  it('reads a one-to-one relationship', () => {
    assert.equal(relatedName({ name: 'Acme' }), 'Acme')
  })

  it('reads a one-to-many relationship and handles empty values', () => {
    assert.equal(relatedName([{ name: 'Software Engineering' }]), 'Software Engineering')
    assert.equal(relatedName([]), null)
    assert.equal(relatedName(null), null)
  })
})
