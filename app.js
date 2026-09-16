import { createContentBrief } from './planner.js'

const form = document.querySelector('#brief-form')
const output = document.querySelector('#brief-output')
const exportButton = document.querySelector('#export-brief')
const copyButton = document.querySelector('#copy-brief')
const resetButton = document.querySelector('#reset-brief')
const savedBriefs = JSON.parse(localStorage.getItem('clipflow-briefs') || '[]')

function createTextElement(tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    return element
}

function renderBrief(brief) {
    output.replaceChildren()

    const card = document.createElement('section')
    card.className = 'brief-card'
    card.setAttribute('aria-live', 'polite')

    card.append(
        createTextElement('p', 'Your content brief'),
        createTextElement('h2', brief.hook),
    )
    card.querySelector('p').className = 'eyebrow'

    const list = document.createElement('ol')
    for (const item of brief.outline) list.append(createTextElement('li', item))

    const caption = document.createElement('p')
    caption.append(createTextElement('strong', 'Caption: '), document.createTextNode(brief.caption))

    const cta = document.createElement('p')
    cta.append(createTextElement('strong', 'Call to action: '), document.createTextNode(brief.callToAction))

    card.append(list, caption, cta)
    output.append(card)
    exportButton.disabled = false
    copyButton.disabled = false
    resetButton.disabled = false
}

function getCurrentBriefText() {
    return output.innerText.trim()
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const brief = createContentBrief(Object.fromEntries(new FormData(form)))
    savedBriefs.unshift({ ...brief, createdAt: new Date().toISOString() })
    localStorage.setItem('clipflow-briefs', JSON.stringify(savedBriefs.slice(0, 25)))
    renderBrief(brief)
})

copyButton.addEventListener('click', async () => {
    const text = getCurrentBriefText()
    if (!text) return
    await navigator.clipboard.writeText(text)
    copyButton.textContent = 'Copied'
    setTimeout(() => { copyButton.textContent = 'Copy brief' }, 1200)
})

exportButton.addEventListener('click', () => {
    const text = getCurrentBriefText()
    if (!text) return
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clipflow-content-brief.txt'
    link.click()
    URL.revokeObjectURL(url)
})

resetButton.addEventListener('click', () => {
    output.replaceChildren(createTextElement('p', 'Your next content brief will appear here.'))
    exportButton.disabled = true
    copyButton.disabled = true
    resetButton.disabled = true
})
