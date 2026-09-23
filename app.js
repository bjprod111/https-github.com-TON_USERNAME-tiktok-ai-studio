import { createContentBrief, generateBriefVariations, templates } from './planner.js'

const form = document.querySelector('#brief-form')
const output = document.querySelector('#brief-output')
const outputTitle = document.querySelector('#output-title')
const outputActions = document.querySelector('#output-actions')
const recentGrid = document.querySelector('#recent-grid')
const historyCount = document.querySelector('#history-count')
const toast = document.querySelector('#toast')
const templateGrid = document.querySelector('#template-grid')
const templateDescription = document.querySelector('#template-description')
const completionBadge = document.querySelector('#completion-badge')
const storageKey = 'clipflow-briefs-v2'

let currentBrief = null
let savedBriefs = readSavedBriefs()
let selectedTemplate = 'standard'

function readSavedBriefs() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') || [] } catch { return [] }
}

function saveBriefs() {
    localStorage.setItem(storageKey, JSON.stringify(savedBriefs.slice(0, 25)))
}

function el(tag, text = '', className = '') {
    const node = document.createElement(tag)
    node.textContent = text
    if (className) node.className = className
    return node
}

function showToast(message) {
    toast.textContent = message
    toast.classList.add('show')
    clearTimeout(showToast.timer)
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200)
}

function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date))
}

function briefText(brief) {
    return `CLIPFLOW CONTENT BRIEF\nTEMPLATE: ${brief.title}\nPLATFORM: ${brief.platform}\n\nHOOK\n${brief.hook}\n\nOUTLINE\n${brief.outline.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\nCAPTION\n${brief.caption}\n\nCALL TO ACTION\n${brief.callToAction}`
}

function syncBadge() {
    if (!currentBrief) {
        completionBadge.textContent = '0 / 4'
        return
    }
    const fields = [currentBrief.hook, ...currentBrief.outline, currentBrief.caption, currentBrief.callToAction]
    const filled = fields.filter(Boolean).length
    completionBadge.textContent = `${Math.min(filled, 4)} / 4`
}

function renderTemplates() {
    templateGrid.replaceChildren()
    Object.entries(templates).forEach(([key, item]) => {
        const button = el('button', '', `template-card${key === selectedTemplate ? ' selected' : ''}`)
        button.type = 'button'
        button.dataset.template = key
        button.innerHTML = `<span class="template-icon">${item.icon}</span><strong>${item.label}</strong><small>${item.description}</small>`
        button.addEventListener('click', () => {
            selectedTemplate = key
            templateDescription.textContent = item.description
            renderTemplates()
        })
        templateGrid.append(button)
    })
}

function createEditableField(label, value, key, multiline = false) {
    const wrap = el('label', '', 'edit-field')
    wrap.append(el('span', label))

    const input = document.createElement(multiline ? 'textarea' : 'input')
    input.value = value
    input.dataset.key = key
    if (multiline) input.rows = 3

    input.addEventListener('input', () => {
        currentBrief[key] = input.value
        saveCurrentBrief()
        syncBadge()
    })

    wrap.append(input)
    return wrap
}

function renderOutlineEditor(brief) {
    const outline = el('div', '', 'edit-field outline-editor')
    outline.append(el('span', 'Outline'))

    brief.outline.forEach((item, index) => {
        const input = document.createElement('input')
        input.value = item
        input.dataset.index = index
        input.addEventListener('input', () => {
            currentBrief.outline[index] = input.value
            saveCurrentBrief()
            syncBadge()
        })
        outline.append(input)
    })

    return outline
}

function renderVariations(brief) {
    const wrapper = el('div', '', 'variant-panel')
    wrapper.append(el('div', 'Content variations', 'variant-header'))
    const list = document.createElement('div')
    list.className = 'variant-grid'

    generateBriefVariations({
        topic: brief.topic,
        audience: brief.audience,
        goal: brief.goal,
        tone: form.tone.value,
        platform: brief.platform,
        template: brief.template,
    }).forEach((item) => {
        const card = document.createElement('article')
        card.className = 'variation-card'
        card.innerHTML = `<strong>${item.label}</strong><p>${item.value}</p>`
        list.append(card)
    })

    wrapper.append(list)
    return wrapper
}

function renderBrief(brief) {
    currentBrief = { ...brief, outline: [...brief.outline] }
    output.replaceChildren()
    output.className = 'brief-card'
    outputTitle.textContent = 'Your workspace is ready'
    syncBadge()

    output.append(
        createEditableField('Hook', brief.hook, 'hook'),
        renderOutlineEditor(brief),
        createEditableField('Caption', brief.caption, 'caption', true),
        createEditableField('Call to action', brief.callToAction, 'callToAction', true),
        renderVariations(brief)
    )

    outputActions.hidden = false
    document.querySelector('#result-panel').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function saveCurrentBrief() {
    if (!currentBrief) return
    savedBriefs = [
        currentBrief,
        ...savedBriefs.filter((item) => item.createdAt !== currentBrief.createdAt),
    ]
    saveBriefs()
    renderHistory()
}

function renderHistory() {
    historyCount.textContent = String(savedBriefs.length)
    recentGrid.replaceChildren()

    if (!savedBriefs.length) {
        recentGrid.append(el('div', 'Generated briefs will be saved here automatically.', 'recent-empty'))
        return
    }

    savedBriefs.slice(0, 3).forEach((brief) => {
        const card = el('article', '', 'recent-card')
        card.tabIndex = 0
        card.append(
            el('time', formatDate(brief.createdAt)),
            el('h3', brief.hook),
            el('p', `${brief.title} · ${brief.platform}`)
        )
        card.addEventListener('click', () => renderBrief(brief))
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') renderBrief(brief)
        })
        recentGrid.append(card)
    })
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return

    const data = Object.fromEntries(new FormData(form))
    const generated = createContentBrief({
        ...data,
        template: selectedTemplate,
        platform: data.platform || 'TikTok',
    })

    currentBrief = {
        ...generated,
        topic: data.topic,
        audience: data.audience,
        goal: data.goal,
        createdAt: new Date().toISOString(),
    }

    savedBriefs = [currentBrief, ...savedBriefs.filter((item) => item.createdAt !== currentBrief.createdAt)]
    saveBriefs()
    renderBrief(currentBrief)
    renderHistory()
    showToast('Workspace generated and saved locally')
})

document.querySelector('#try-example').addEventListener('click', () => {
    form.topic.value = 'A simple morning routine for more energy'
    form.audience.value = 'busy professionals'
    form.goal.value = 'save the routine for tomorrow'
    form.tone.value = 'Friendly and confident'
    selectedTemplate = 'education'
    templateDescription.textContent = templates.education.description
    renderTemplates()
    showToast('Example added — choose Generate workspace')
})

document.querySelector('#copy-brief').addEventListener('click', async () => {
    if (!currentBrief) return
    try {
        await navigator.clipboard.writeText(briefText(currentBrief))
        showToast('Brief copied to clipboard')
    } catch {
        showToast('Copy is not available in this browser')
    }
})

document.querySelector('#export-brief').addEventListener('click', () => {
    if (!currentBrief) return
    const file = new Blob([briefText(currentBrief)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clipflow-content-brief.txt'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Brief downloaded')
})

function resetBrief() {
    currentBrief = null
    output.className = 'empty-state'
    output.innerHTML = '<div class="empty-icon">✦</div><h3>Your editable workspace will appear here</h3><p>Generate a brief to unlock editable hook, outline, caption, CTA, and content variations.</p>'
    outputTitle.textContent = 'Ready when you are'
    completionBadge.textContent = '0 / 4'
    outputActions.hidden = true
}

document.querySelector('#reset-brief').addEventListener('click', resetBrief)
document.querySelector('#clear-all').addEventListener('click', () => {
    form.reset()
    resetBrief()
    showToast('Current draft cleared')
})

document.querySelector('#clear-history').addEventListener('click', () => {
    savedBriefs = []
    saveBriefs()
    renderHistory()
    showToast('History cleared')
})

form.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        form.requestSubmit()
    }
})

document.querySelector('#mobile-menu').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open')
})

renderTemplates()
renderHistory()
