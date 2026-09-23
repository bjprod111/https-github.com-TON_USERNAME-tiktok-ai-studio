import { createContentBrief } from './planner.js'

const form = document.querySelector('#brief-form')
const output = document.querySelector('#brief-output')
const outputTitle = document.querySelector('#output-title')
const outputActions = document.querySelector('#output-actions')
const recentGrid = document.querySelector('#recent-grid')
const historyCount = document.querySelector('#history-count')
const toast = document.querySelector('#toast')
const storageKey = 'clipflow-briefs'
let currentBrief = null
let savedBriefs = readSavedBriefs()

function readSavedBriefs() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') || [] } catch { return [] }
}
function saveBriefs() { localStorage.setItem(storageKey, JSON.stringify(savedBriefs.slice(0, 25))) }
function textElement(tag, text, className = '') { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200) }
function formatDate(date) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date)) }
function briefText(brief) { return `CLIPFLOW CONTENT BRIEF\n\nHOOK\n${brief.hook}\n\nOUTLINE\n${brief.outline.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\nCAPTION\n${brief.caption}\n\nCALL TO ACTION\n${brief.callToAction}` }

function renderBrief(brief) {
    currentBrief = brief
    output.replaceChildren()
    output.className = 'brief-card'
    outputTitle.textContent = 'Your brief is ready'
    const label = textElement('span', 'Hook', 'brief-label')
    const hook = textElement('p', brief.hook, 'brief-hook')
    const outline = document.createElement('div'); outline.className = 'brief-block'; outline.append(textElement('strong', 'Suggested outline'))
    const list = document.createElement('ol'); brief.outline.forEach(item => list.append(textElement('li', item))); outline.append(list)
    const caption = document.createElement('div'); caption.className = 'brief-block'; caption.append(textElement('strong', 'Caption'), textElement('p', brief.caption))
    const cta = document.createElement('div'); cta.className = 'brief-block'; cta.append(textElement('strong', 'Call to action'), textElement('p', brief.callToAction))
    output.append(label, hook, outline, caption, cta)
    outputActions.hidden = false
    document.querySelector('#result-panel').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function renderHistory() {
    historyCount.textContent = savedBriefs.length
    recentGrid.replaceChildren()
    if (!savedBriefs.length) { recentGrid.append(textElement('div', 'Generated briefs will be saved here automatically.', 'recent-empty')); return }
    savedBriefs.slice(0, 3).forEach((brief, index) => {
        const card = document.createElement('article'); card.className = 'recent-card'; card.tabIndex = 0
        card.append(textElement('time', formatDate(brief.createdAt)), textElement('h3', brief.hook), textElement('p', brief.topic || brief.caption))
        card.addEventListener('click', () => renderBrief(brief)); card.addEventListener('keydown', event => { if (event.key === 'Enter') renderBrief(brief) })
        recentGrid.append(card)
    })
}

form.addEventListener('submit', event => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const data = Object.fromEntries(new FormData(form))
    const brief = { ...createContentBrief(data), topic: data.topic, createdAt: new Date().toISOString() }
    savedBriefs = [brief, ...savedBriefs.filter(item => item.topic !== brief.topic)]
    saveBriefs(); renderBrief(brief); renderHistory(); showToast('Brief generated and saved locally')
})
document.querySelector('#try-example').addEventListener('click', () => {
    form.topic.value = 'A simple morning routine for more energy'; form.audience.value = 'busy professionals'; form.goal.value = 'save the routine for tomorrow'; form.tone.value = 'Friendly and confident'; form.platform.value = 'TikTok'; form.topic.focus(); showToast('Example added — ready to generate')
})
document.querySelector('#copy-brief').addEventListener('click', async () => {
    if (!currentBrief) return
    try { await navigator.clipboard.writeText(briefText(currentBrief)); showToast('Brief copied to clipboard') } catch { showToast('Copy is not available in this browser') }
})
document.querySelector('#export-brief').addEventListener('click', () => {
    if (!currentBrief) return
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([briefText(currentBrief)], { type: 'text/plain;charset=utf-8' })); link.download = 'clipflow-content-brief.txt'; link.click(); URL.revokeObjectURL(link.href); showToast('Brief downloaded')
})
function resetBrief() { currentBrief = null; output.className = 'empty-state'; output.innerHTML = '<div class="empty-icon">✦</div><h3>Your brief will appear here</h3><p>Fill in the details on the left and click <strong>Generate brief</strong> to get a hook, outline, caption, and call to action.</p>'; outputTitle.textContent = 'Ready when you are'; outputActions.hidden = true }
document.querySelector('#reset-brief').addEventListener('click', resetBrief)
document.querySelector('#clear-all').addEventListener('click', () => { form.reset(); resetBrief(); showToast('Current draft cleared') })
document.querySelector('#clear-history').addEventListener('click', () => { if (!savedBriefs.length) return; savedBriefs = []; saveBriefs(); renderHistory(); showToast('History cleared') })
form.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') form.requestSubmit() })
document.querySelector('#mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'))
renderHistory()
