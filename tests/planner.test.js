import test from 'node:test'
import assert from 'node:assert/strict'
import { createContentBrief } from '../planner.js'

test('creates a complete brief from creator inputs', () => {
    const brief = createContentBrief({
        topic: 'strength training',
        audience: 'new gym members',
        goal: 'book a consultation',
        tone: 'friendly',
    })

    assert.match(brief.hook, /new gym members/)
    assert.equal(brief.outline.length, 3)
    assert.match(brief.caption, /strength training/)
    assert.match(brief.callToAction, /book a consultation/)
})

test('falls back safely when inputs are missing', () => {
    const brief = createContentBrief()

    assert.match(brief.hook, /your audience/)
    assert.match(brief.hook, /your offer/)
    assert.equal(brief.outline.length, 3)
    assert.match(brief.callToAction, /start a conversation/)
})

test('trims whitespace and preserves user intent', () => {
    const brief = createContentBrief({
        topic: '  meal prep  ',
        audience: ' busy students ',
        goal: ' save money ',
        tone: ' practical ',
    })

    assert.match(brief.hook, /busy students/)
    assert.match(brief.caption, /^meal prep, made practical\./)
    assert.match(brief.callToAction, /save money/)
})
