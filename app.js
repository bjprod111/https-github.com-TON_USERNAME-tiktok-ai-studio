import { createContentBrief } from './planner.js'

const form = document.querySelector('#brief-form')
const output = document.querySelector('#brief-output')
const exportButton = document.querySelector('#export-brief')
const savedBriefs = JSON.parse(localStorage.getItem('clipflow-briefs') || '[]')

function renderBrief(brief) {
    output.innerHTML = `
        <section class="brief-card" aria-live="polite">
            <p class="eyebrow">Your content brief</p>
            <h2>${brief.hook}</h2>
            <ol>${brief.outline.map((item) => `<li>${item}</li>`).join('')}</ol>
            <p><strong>Caption:</strong> ${brief.caption}</p>
            <p><strong>Call to action:</strong> ${brief.callToAction}</p>
        </section>`
    exportButton.disabled = false
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const brief = createContentBrief(Object.fromEntries(new FormData(form)))
    savedBriefs.unshift({ ...brief, createdAt: new Date().toISOString() })
    localStorage.setItem('clipflow-briefs', JSON.stringify(savedBriefs.slice(0, 25)))
    renderBrief(brief)
})

exportButton.addEventListener('click', () => {
    const text = output.innerText.trim()
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clipflow-content-brief.txt'
    link.click()
    URL.revokeObjectURL(url)
})
