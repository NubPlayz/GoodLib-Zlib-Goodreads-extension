import "./content.css"

export const config = {
  matches: ["https://www.goodreads.com/book/*"]
}

const CHIP_ATTR = "data-goodlib-zlib-chip"
const CHIP_CLASS = "goodlib-chip"
const ZLIB_ENABLED_KEY = "zlibEnabled"
const ANNA_ENABLED_KEY = "annaEnabled"
const CHIPS_WRAP_ATTR = "data-goodlib-chip-wrap"

const titleSelectors = [
  "h1[data-testid='bookTitle']",
  "h1.Text__title1",
  "h1"
]

const authorSelectors = [
  "a[data-testid='name']",
  "[data-testid='authorName']",
  ".ContributorLinksList a.ContributorLink",
  "a.ContributorLink",
  "span.ContributorLink__name"
]

const getBookTitle = (): HTMLElement | null => {
  for (const selector of titleSelectors) {
    const node = document.querySelector(selector)
    if (node instanceof HTMLElement && node.innerText.trim().length > 0) {
      return node
    }
  }

  return null
}

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim()

const getPrimaryAuthor = (): string => {
  for (const selector of authorSelectors) {
    const node = document.querySelector(selector)
    if (!(node instanceof HTMLElement)) continue
    const text = normalizeText(node.innerText)
    if (text.length > 0) {
      return text
    }
  }

  return ""
}

const removeChip = () => {
  const chips = document.querySelectorAll(`[${CHIP_ATTR}]`)
  chips.forEach((chip) => chip.remove())

  const wrap = document.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (wrap && wrap.childElementCount === 0) {
    wrap.remove()
  }
}

const removeChipBySource = (source: SourceKey) => {
  const chip = document.querySelector(`[${CHIP_ATTR}="${source}"]`)
  if (chip) {
    chip.remove()
  }

  const wrap = document.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (wrap && wrap.childElementCount === 0) {
    wrap.remove()
  }
}

type SourceKey = "zlib" | "anna"

const sourceMeta: Record<SourceKey, { label: string; glyph: string }> = {
  zlib: { label: "Z-Lib", glyph: "z" },
  anna: { label: "Anna's", glyph: "A" }
}

const buildSourceUrl = (source: SourceKey, query: string) => {
  const encoded = encodeURIComponent(query)
  if (source === "anna") {
    return `https://annas-archive.gd/search?q=${encoded}`
  }

  return `https://z-lib.gl/s/${encoded}`
}

const makeChip = (source: SourceKey, searchQuery: string) => {
  const chip = document.createElement("span")
  chip.setAttribute(CHIP_ATTR, source)
  chip.className = `${CHIP_CLASS} ${CHIP_CLASS}--${source}`
  chip.innerHTML = `<span class="goodlib-chip-icon"><span class="goodlib-chip-glyph">${sourceMeta[source].glyph}</span></span><span class="goodlib-chip-label">${sourceMeta[source].label}</span>`
  chip.addEventListener("click", () => {
    window.location.assign(buildSourceUrl(source, searchQuery))
  })

  return chip
}

const injectChips = (enabledBySource: Record<SourceKey, boolean>) => {
  const title = getBookTitle()
  if (!title) return

  const bookTitle = normalizeText(title.textContent ?? "")
  if (!bookTitle) return

  const primaryAuthor = getPrimaryAuthor()
  const queryParts = [bookTitle, primaryAuthor].filter(Boolean)
  const searchQuery = queryParts.join(" ")

  let wrap = title.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (!(wrap instanceof HTMLElement)) {
    wrap = document.createElement("span")
    wrap.setAttribute(CHIPS_WRAP_ATTR, "true")
    wrap.className = "goodlib-chip-wrap"
    title.appendChild(wrap)
  }

  if (enabledBySource.zlib && !wrap.querySelector(`[${CHIP_ATTR}="zlib"]`)) {
    wrap.appendChild(makeChip("zlib", searchQuery))
  }

  if (!enabledBySource.zlib) {
    removeChipBySource("zlib")
  }

  if (enabledBySource.anna && !wrap.querySelector(`[${CHIP_ATTR}="anna"]`)) {
    wrap.appendChild(makeChip("anna", searchQuery))
  }

  if (!enabledBySource.anna) {
    removeChipBySource("anna")
  }
}

const enabledBySource: Record<SourceKey, boolean> = {
  zlib: true,
  anna: true
}

const syncChipToState = () => {
  if (!enabledBySource.zlib && !enabledBySource.anna) {
    removeChip()
    return
  }

  injectChips(enabledBySource)
}

const initializeEnabledState = () => {
  chrome.storage.sync.get([ZLIB_ENABLED_KEY, ANNA_ENABLED_KEY], (result) => {
    const zlibStored = result[ZLIB_ENABLED_KEY]
    const annaStored = result[ANNA_ENABLED_KEY]
    enabledBySource.zlib = typeof zlibStored === "boolean" ? zlibStored : true
    enabledBySource.anna = typeof annaStored === "boolean" ? annaStored : true
    syncChipToState()
  })
}

initializeEnabledState()

let injectTimeout: ReturnType<typeof setTimeout> | null = null

const observer = new MutationObserver(() => {
  if (!enabledBySource.zlib && !enabledBySource.anna) return

  if (injectTimeout) {
    clearTimeout(injectTimeout)
  }

  injectTimeout = setTimeout(() => {
    injectChips(enabledBySource)
  }, 120)
})

observer.observe(document.body, { childList: true, subtree: true })

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return
  if (ZLIB_ENABLED_KEY in changes) {
    const zlibNext = changes[ZLIB_ENABLED_KEY].newValue
    enabledBySource.zlib = typeof zlibNext === "boolean" ? zlibNext : true
  }
  if (ANNA_ENABLED_KEY in changes) {
    const annaNext = changes[ANNA_ENABLED_KEY].newValue
    enabledBySource.anna = typeof annaNext === "boolean" ? annaNext : true
  }
  syncChipToState()
})
