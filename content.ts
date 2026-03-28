import "./content.css"
import {
  CUSTOM_SOURCES_KEY,
  ANNA_DOMAIN_KEY,
  DEFAULT_ANNA_DOMAIN,
  ensureDefaultCustomSourcesInStorage,
  DEFAULT_ZLIB_DOMAIN,
  ZLIB_DOMAIN_KEY,
  getSourceGlyph,
  normalizeCustomSources,
  renderSourceTemplate,
  sourceConfigByKey,
  sourceKeys
} from "./sources"
import type {
  SearchTemplateContext,
  SourceKey,
  StoredCustomSource
} from "./sources"

export const config = {
  matches: [
    "https://www.goodreads.com/book/*",
    "https://hardcover.app/*",
    "https://app.thestorygraph.com/*",
    "https://www.thestorygraph.com/*",
    "https://www.babelio.com/livres/*",
    "https://www.novelupdates.com/series/*"
  ]
}

const CHIP_ATTR = "data-goodlib-zlib-chip"
const CHIP_CLASS = "goodlib-chip"
const CHIPS_WRAP_ATTR = "data-goodlib-chip-wrap"
const SEARCH_AUTHOR_ATTR = "data-search-author"
const SEARCH_QUERY_ATTR = "data-search-query"
const SEARCH_TITLE_ATTR = "data-search-title"
const HARDCOVER_HOST = "hardcover.app"
const GOODREADS_HOST = "goodreads.com"
const STORYGRAPH_HOST = "thestorygraph.com"
const BABELIO_HOST = "babelio.com"
const NOVELUPDATES_HOST = "novelupdates.com"

const goodreadsTitleSelectors = [
  "h1[data-testid='bookTitle']",
  "h1.Text__title1",
  "h1"
]

const goodreadsAuthorSelectors = [
  "a[data-testid='name']",
  "[data-testid='authorName']",
  ".ContributorLinksList a.ContributorLink",
  "a.ContributorLink",
  "span.ContributorLink__name"
]

const hardcoverTitleSelectors = ["main h1", "h1"]
const storyGraphTitleSelectors = [
  ".book-title-author-and-series h3",
  "[data-testid='book-title']",
  "h3.font-semibold.text-2xl",
  "h3.font-semibold",
  "h3.font-bold",
  "h3"
]
const storyGraphAuthorSelectors = [".book-title-author-and-series a[href^='/authors/']", "a[href^='/authors/']"]

const babelioTitleSelectors = ["h1[itemprop='name']", "h1"]
const babelioAuthorSelectors = ["span[itemprop='author'] [itemprop='name']", "a[href^='/auteur/']", ".author", "[itemprop='author']"]

const novelUpdatesTitleSelectors = [".seriestitlenu", ".seriestitle", "div.seriestitlenu", ".series-title"]
const novelUpdatesAuthorSelectors = ["a[id='authtag']", "#authtag", "a[href*='/nauthor/']", ".author"]

const isHardcoverPage = () => window.location.hostname === HARDCOVER_HOST
const isGoodreadsPage = () => window.location.hostname.endsWith(GOODREADS_HOST)
const isStoryGraphPage = () =>
  window.location.hostname.endsWith(STORYGRAPH_HOST) &&
  window.location.pathname.includes("/books/")
const isBabelioPage = () =>
  window.location.hostname.endsWith(BABELIO_HOST) &&
  window.location.pathname.includes("/livres/")
const isNovelUpdatesPage = () =>
  window.location.hostname.endsWith(NOVELUPDATES_HOST) &&
  window.location.pathname.includes("/series/")

const getHardcoverTitle = (): HTMLElement | null => {
  for (const selector of hardcoverTitleSelectors) {
    const nodes = document.querySelectorAll(selector)
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index]
      if (!(node instanceof HTMLElement)) continue
      const text = normalizeText(node.textContent ?? "")
      if (text.length === 0) continue

      const authorLink = node.parentElement?.querySelector('a[href^="/authors/"]')
      if (authorLink instanceof HTMLElement) {
        return node
      }
    }
  }

  return null
}

const getBookTitle = (): HTMLElement | null => {
  if (isHardcoverPage()) {
    return getHardcoverTitle()
  }

  const selectors = isStoryGraphPage()
    ? storyGraphTitleSelectors
    : isGoodreadsPage()
      ? goodreadsTitleSelectors
      : isBabelioPage()
        ? babelioTitleSelectors
        : isNovelUpdatesPage()
          ? novelUpdatesTitleSelectors
          : null

  if (!selectors) return null

  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (!(node instanceof HTMLElement)) continue
      if ((node.textContent ?? "").trim().length === 0) continue
      if (node.offsetParent === null && node.tagName !== "BODY") continue
      return node
    }
  }

  return null
}

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim()

const getCleanBookTitle = (title: HTMLElement): string => {
  const clone = title.cloneNode(true) as HTMLElement
  const injectedWrap = clone.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (injectedWrap) {
    injectedWrap.remove()
  }

  return normalizeText(clone.textContent ?? "")
}

const getPrimaryAuthor = (): string => {
  if (isHardcoverPage()) {
    const title = getBookTitle()
    const titleBlock = title?.parentElement
    if (titleBlock) {
      const authorLinks = titleBlock.querySelectorAll('a[href^="/authors/"]')
      for (let index = 0; index < authorLinks.length; index += 1) {
        const node = authorLinks[index]
        if (!(node instanceof HTMLElement)) continue
        const text = normalizeText(node.textContent ?? "")
        if (text.length > 0) {
          return text
        }
      }
    }
  }

  const selectors = isStoryGraphPage()
    ? storyGraphAuthorSelectors
    : isGoodreadsPage()
      ? goodreadsAuthorSelectors
      : isBabelioPage()
        ? babelioAuthorSelectors
        : isNovelUpdatesPage()
          ? novelUpdatesAuthorSelectors
          : null

  if (!selectors) return ""

  for (const selector of selectors) {
    const node = document.querySelector(selector)
    if (!(node instanceof HTMLElement)) continue
    const text = normalizeText(node.textContent ?? "")
    if (text.length > 0) {
      return text
    }
  }

  return ""
}

const buildSearchQuery = (title: string, author?: string) =>
  [title, author].filter(Boolean).join(" ")

const removeChip = () => {
  const chips = document.querySelectorAll(`[${CHIP_ATTR}]`)
  chips.forEach((chip) => chip.remove())

  const wrap = document.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (wrap && wrap.childElementCount === 0) {
    wrap.remove()
  }
}

type RuntimeSource = {
  buildUrl: (context: SearchTemplateContext) => string
  chipGlyph: string
  id: string
  label: string
}

let currentZlibDomain = DEFAULT_ZLIB_DOMAIN
let currentAnnaDomain = DEFAULT_ANNA_DOMAIN
let customSources: StoredCustomSource[] = []

const buildSourceUrl = (source: SourceKey, query: string) => {
  const encoded = encodeURIComponent(query)
  if (source === "anna") {
    return `https://${currentAnnaDomain}/search?q=${encoded}`
  }
  if (source === "gutenberg") {
    return `https://www.gutenberg.org/ebooks/search/?query=${encoded}`
  }

  return `https://${currentZlibDomain}/s/${encoded}`
}

const getActiveSources = (): RuntimeSource[] => {
  const builtInSources = sourceKeys
    .filter((source) => enabledBySource[source])
    .map((source) => ({
      buildUrl: ({ query }: SearchTemplateContext) => buildSourceUrl(source, query),
      chipGlyph: sourceConfigByKey[source].chipGlyph,
      id: source,
      label: sourceConfigByKey[source].label
    }))

  const customRuntimeSources = customSources
    .filter((source) => source.enabled)
    .map((source) => ({
      buildUrl: (context: SearchTemplateContext) =>
        renderSourceTemplate(source.template, context),
      chipGlyph: getSourceGlyph(source.label),
      id: source.id,
      label: source.label
    }))

  return [...builtInSources, ...customRuntimeSources]
}

const applySearchContext = (chip: HTMLElement, context: SearchTemplateContext) => {
  chip.setAttribute(SEARCH_QUERY_ATTR, context.query)
  chip.setAttribute(SEARCH_TITLE_ATTR, context.title)
  chip.setAttribute(SEARCH_AUTHOR_ATTR, context.author)
}

const readSearchContext = (chip: HTMLElement): SearchTemplateContext => ({
  author: chip.getAttribute(SEARCH_AUTHOR_ATTR) ?? "",
  query: chip.getAttribute(SEARCH_QUERY_ATTR) ?? "",
  title: chip.getAttribute(SEARCH_TITLE_ATTR) ?? ""
})

const makeChip = (source: RuntimeSource, context: SearchTemplateContext) => {
  const chip = document.createElement("span")
  chip.setAttribute(CHIP_ATTR, source.id)
  chip.className = `${CHIP_CLASS} ${CHIP_CLASS}--${source.id}`
  applySearchContext(chip, context)
  const glyph = source.chipGlyph
  const glyphClass =
    glyph.length > 1 ? "goodlib-chip-glyph goodlib-chip-glyph--wide" : "goodlib-chip-glyph"

  const icon = document.createElement("span")
  icon.className = "goodlib-chip-icon"

  const glyphNode = document.createElement("span")
  glyphNode.className = glyphClass
  glyphNode.textContent = glyph
  icon.appendChild(glyphNode)

  const label = document.createElement("span")
  label.className = "goodlib-chip-label"
  label.textContent = source.label

  chip.replaceChildren(icon, label)
  chip.addEventListener("click", () => {
    window.open(source.buildUrl(readSearchContext(chip)), "_blank", "noopener,noreferrer")
  })

  return chip
}

const injectChips = (sources: RuntimeSource[]) => {
  const title = getBookTitle()
  if (!title) return

  const bookTitle = getCleanBookTitle(title)
  if (!bookTitle) return

  const primaryAuthor = getPrimaryAuthor()
  const searchContext: SearchTemplateContext = {
    author: primaryAuthor,
    query: buildSearchQuery(bookTitle, primaryAuthor),
    title: bookTitle
  }

  let wrap = title.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (!(wrap instanceof HTMLElement)) {
    wrap = document.createElement("span")
    wrap.setAttribute(CHIPS_WRAP_ATTR, "true")
    wrap.className = "goodlib-chip-wrap"
    title.appendChild(wrap)
  }

  const orderedChips: HTMLElement[] = []

  for (const source of sources) {
    let chip = wrap.querySelector(`[${CHIP_ATTR}="${source.id}"]`)
    if (!(chip instanceof HTMLElement)) {
      chip = makeChip(source, searchContext)
    }

    applySearchContext(chip as HTMLElement, searchContext)
    orderedChips.push(chip as HTMLElement)
  }

  const currentOrder = Array.from(wrap.children).filter(
    (node) => node instanceof HTMLElement && node.hasAttribute(CHIP_ATTR)
  )

  const needsReorder =
    currentOrder.length !== orderedChips.length ||
    currentOrder.some((node, index) => node !== orderedChips[index])

  if (needsReorder) {
    wrap.replaceChildren(...orderedChips)
  }
}

const enabledBySource = Object.fromEntries(sourceKeys.map((source) => [source, true])) as Record<
  SourceKey,
  boolean
>

const syncChipToState = () => {
  const activeSources = getActiveSources()
  if (activeSources.length === 0) {
    removeChip()
    return
  }

  injectChips(activeSources)
}

const initializeEnabledState = () => {
  chrome.storage.sync.get(
    [
      ...sourceKeys.map((source) => sourceConfigByKey[source].enabledStorageKey),
      ZLIB_DOMAIN_KEY,
      ANNA_DOMAIN_KEY,
      CUSTOM_SOURCES_KEY
    ],
    (result) => {
      for (const source of sourceKeys) {
        const storedValue = result[sourceConfigByKey[source].enabledStorageKey]
        enabledBySource[source] = typeof storedValue === "boolean" ? storedValue : true
      }

      if (result[ZLIB_DOMAIN_KEY]) {
        currentZlibDomain = result[ZLIB_DOMAIN_KEY]
      }
      if (result[ANNA_DOMAIN_KEY]) {
        currentAnnaDomain = result[ANNA_DOMAIN_KEY]
      }
      customSources = normalizeCustomSources(result[CUSTOM_SOURCES_KEY])
      syncChipToState()
    }
  )
}

initializeEnabledState()
ensureDefaultCustomSourcesInStorage().then((storedSources) => {
  customSources = storedSources
  syncChipToState()
})

let injectTimeout: ReturnType<typeof setTimeout> | null = null
let lastUrl = window.location.href

const handleDomChange = () => {
  if (getActiveSources().length === 0) return

  if (injectTimeout) {
    clearTimeout(injectTimeout)
  }

  injectTimeout = setTimeout(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href
      removeChip()
    }
    injectChips(getActiveSources())
  }, 120)
}

const observer = new MutationObserver(handleDomChange)

observer.observe(document.body, { childList: true, subtree: true })

setInterval(() => {
  if (lastUrl !== window.location.href) {
    handleDomChange()
  }
}, 500)

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return

  if (ZLIB_DOMAIN_KEY in changes) {
    currentZlibDomain = changes[ZLIB_DOMAIN_KEY].newValue || DEFAULT_ZLIB_DOMAIN
  }
  if (ANNA_DOMAIN_KEY in changes) {
    currentAnnaDomain = changes[ANNA_DOMAIN_KEY].newValue || DEFAULT_ANNA_DOMAIN
  }
  if (CUSTOM_SOURCES_KEY in changes) {
    customSources = normalizeCustomSources(changes[CUSTOM_SOURCES_KEY].newValue)
  }

  for (const source of sourceKeys) {
    const change = changes[sourceConfigByKey[source].enabledStorageKey]
    if (!change) continue

    enabledBySource[source] = typeof change.newValue === "boolean" ? change.newValue : true
  }
  syncChipToState()
})
