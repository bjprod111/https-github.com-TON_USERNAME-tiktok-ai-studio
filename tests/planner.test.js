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
