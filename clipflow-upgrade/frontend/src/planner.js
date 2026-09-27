const TEMPLATE_CATALOG = {
    standard: { label: 'Quick brief', icon: '✦', description: 'A balanced short-form video brief.' },
    education: { label: 'Teach it', icon: '▤', description: 'Practical lessons with clear takeaways.' },
    story: { label: 'Story arc', icon: '◒', description: 'A relatable beginning, tension, and payoff.' },
    launch: { label: 'Launch', icon: '↗', description: 'A focused promotion with a strong CTA.' },
}

export const templates = TEMPLATE_CATALOG

export function createContentBrief({ topic = '', audience = '', goal = '', tone = '', platform = 'TikTok', template = 'standard' } = {}) {
    const cleanTopic = String(topic).trim() || 'your offer'
    const cleanAudience = String(audience).trim() || 'your audience'
    const cleanGoal = String(goal).trim() || 'start a conversation'
    const cleanTone = String(tone).trim() || 'clear and useful'
    const templateKey = TEMPLATE_CATALOG[template] ? template : 'standard'

    const hooks = {
        standard: `Stop scrolling if you are ${cleanAudience}: here is what to know about ${cleanTopic}.`,
        education: `Most ${cleanAudience} get ${cleanTopic} wrong. Here is the simple way to do it.`,
        story: `I tried ${cleanTopic} so ${cleanAudience} would not have to learn it the hard way.`,
        launch: `${cleanAudience}, meet the easier way to ${cleanTopic}.`,
    }

    const outlines = {
        standard: [
            `Name the problem ${cleanAudience} face.`,
            `Show one useful point about ${cleanTopic}.`,
            `Give a simple next step to ${cleanGoal}.`,
        ],
        education: [
            `Open with the common mistake around ${cleanTopic}.`,
            `Teach three practical points in a clear sequence.`,
            `Invite viewers to try the first step today.`,
        ],
        story: [
            `Set the scene and explain why ${cleanTopic} mattered.`,
            `Share the obstacle, lesson or turning point.`,
            `Reveal the result and what ${cleanAudience} can do next.`,
        ],
        launch: [
            `Introduce the outcome ${cleanAudience} wants.`,
            `Show why this approach is different and useful.`,
            `Make a direct invitation to ${cleanGoal}.`,
        ],
    }

    return {
        template: templateKey,
        title: TEMPLATE_CATALOG[templateKey].label,
        platform,
        hook: hooks[templateKey] || hooks.standard,
        outline: outlines[templateKey] || outlines.standard,
        caption: `${cleanTopic}, made ${cleanTone}. Save this for your next move.`,
        callToAction: `Reply if you want help to ${cleanGoal}.`,
    }
}

export function generateBriefVariations({ topic = '', audience = '', goal = '', tone = '', platform = 'TikTok', template = 'standard' } = {}) {
    const brief = createContentBrief({ topic, audience, goal, tone, platform, template })

    return [
        { label: 'Hook angle', value: `${brief.hook} ${platform}` },
        { label: 'Caption angle', value: `${brief.caption} ${goal}` },
        { label: 'CTA angle', value: `${brief.callToAction} ${tone}.` },
        { label: 'Short hook', value: `${brief.hook.split('.')[0]}.` },
    ]
}
