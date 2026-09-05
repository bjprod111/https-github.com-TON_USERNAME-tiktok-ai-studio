/**
 * Produces an editable short-form content brief without calling a third-party
 * platform or sending user data anywhere.
 */
export function createContentBrief({ topic, audience, goal, tone }) {
    const cleanTopic = topic.trim() || 'your offer'
    const cleanAudience = audience.trim() || 'your audience'
    const cleanGoal = goal.trim() || 'start a conversation'
    const cleanTone = tone.trim() || 'clear and useful'

    return {
        hook: `Stop scrolling if you are ${cleanAudience}: here is what to know about ${cleanTopic}.`,
        outline: [
            `Name the problem ${cleanAudience} face.`,
            `Show one useful point about ${cleanTopic}.`,
            `Give a simple next step to ${cleanGoal}.`,
        ],
        caption: `${cleanTopic}, made ${cleanTone}. Save this for your next move.`,
        callToAction: `Reply if you want help to ${cleanGoal}.`,
    }
}
