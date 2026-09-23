import test from 'node:test'
import assert from 'node:assert/strict'
import { createContentBrief, generateBriefVariations } from '../planner.js'

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
    assert.equal(brief.outline.length, 3)
    assert.match(brief.callToAction, /start a conversation/)
})

test('supports multiple monetizable templates', () => {
    const brief = createContentBrief({
        topic: 'meal prep',
        audience: 'busy students',
        goal: 'save money',
        template: 'education',
    })

    assert.equal(brief.title, 'Teach it')
    assert.match(brief.outline[0], /common mistake/)
})

test('generates variation content for the editing workspace', () => {
    const variations = generateBriefVariations({
        topic: 'meal prep',
        audience: 'busy students',
        goal: 'save money',
        tone: 'friendly',
        template: 'education',
    })

    assert.equal(variations.length, 4)
    assert.match(variations[0].value, /busy students/)
})
