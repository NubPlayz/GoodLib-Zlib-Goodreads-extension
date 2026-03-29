import "./content.css"

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
const ZLIB_ENABLED_KEY = "zlibEnabled"
const ANNA_ENABLED_KEY = "annaEnabled"
const AUDIOBOOKBAY_ENABLED_KEY = "audiobookbayEnabled"
const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"
const CHIPS_WRAP_ATTR = "data-goodlib-chip-wrap"
const HARDCOVER_HOST = "hardcover.app"
const GOODREADS_HOST = "goodreads.com"
const STORYGRAPH_HOST = "thestorygraph.com"
const BABELIO_HOST = "babelio.com"
const NOVELUPDATES_HOST = "novelupdates.com"
const ZLIB_DOMAIN_KEY = "zlibDomain"
const DEFAULT_DOMAIN = "z-lib.sk"
const ANNA_DOMAIN_KEY = "annaDomain"
const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
const AUDIOBOOKBAY_DOMAIN_KEY = "audiobookbayDomain"
const DEFAULT_AUDIOBOOKBAY_DOMAIN = "https://audiobookbay.lu"

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

type SourceKey = "zlib" | "anna" | "audiobookbay" | "gutenberg"

const sourceMeta: Record<SourceKey, { label: string; glyph: string }> = {
  zlib: { label: "Z-Lib", glyph: "z" },
  anna: { label: "Anna's", glyph: "A" },
  audiobookbay: { label: "AudiobookBay", glyph: "AB" },
  gutenberg: { label: "Gutenberg", glyph: "PG" }
}

let currentZlibDomain = DEFAULT_DOMAIN
let currentAnnaDomain = DEFAULT_ANNA_DOMAIN
let currentAudiobookbayDomain = DEFAULT_AUDIOBOOKBAY_DOMAIN

const normalizeAudiobookbayDomain = (value: string) => {
  const trimmed = value.trim().replace(/\/+$/, "")
  if (!trimmed) {
    return DEFAULT_AUDIOBOOKBAY_DOMAIN
  }

  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`
}

const buildSourceUrl = (source: SourceKey, query: string) => {
  const encoded = encodeURIComponent(query)
  if (source === "anna") {
    return `https://${currentAnnaDomain}/search?q=${encoded}`
  }
  if (source === "audiobookbay") {
    const normalizedAudiobookQuery = String(query).toLowerCase()
    const url = new URL("/", normalizeAudiobookbayDomain(currentAudiobookbayDomain))
    url.searchParams.set("s", normalizedAudiobookQuery)
    url.searchParams.set("cat", "undefined,undefined")
    return url.toString()
  }
  if (source === "gutenberg") {
    return `https://www.gutenberg.org/ebooks/search/?query=${encoded}`
  }

  return `https://${currentZlibDomain}/s/${encoded}`
}

const makeChip = (source: SourceKey, searchQuery: string) => {
  const chip = document.createElement("span")
  chip.setAttribute(CHIP_ATTR, source)
  chip.className = `${CHIP_CLASS} ${CHIP_CLASS}--${source}`
  chip.setAttribute("data-search-query", searchQuery)
  const glyph = sourceMeta[source].glyph
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
  label.textContent = sourceMeta[source].label

  chip.replaceChildren(icon, label)
  chip.addEventListener("click", () => {
    const query = chip.getAttribute("data-search-query") ?? searchQuery
    window.open(buildSourceUrl(source, query), "_blank", "noopener,noreferrer")
  })

  return chip
}

const injectChips = (enabledBySource: Record<SourceKey, boolean>) => {
  const title = getBookTitle()
  if (!title) return

  const bookTitle = getCleanBookTitle(title)
  if (!bookTitle) return

  const primaryAuthor = getPrimaryAuthor()
  const searchQuery = buildSearchQuery(bookTitle, primaryAuthor)

  let wrap = title.querySelector(`[${CHIPS_WRAP_ATTR}]`)
  if (!(wrap instanceof HTMLElement)) {
    wrap = document.createElement("span")
    wrap.setAttribute(CHIPS_WRAP_ATTR, "true")
    wrap.className = "goodlib-chip-wrap"
    title.appendChild(wrap)
  }

  const orderedChips: HTMLElement[] = []

  let zlibChip = wrap.querySelector(`[${CHIP_ATTR}="zlib"]`)
  if (!(zlibChip instanceof HTMLElement) && enabledBySource.zlib) {
    zlibChip = makeChip("zlib", searchQuery)
  }
  if (zlibChip instanceof HTMLElement && enabledBySource.zlib) {
    zlibChip.setAttribute("data-search-query", searchQuery)
    orderedChips.push(zlibChip)
  }

  let annaChip = wrap.querySelector(`[${CHIP_ATTR}="anna"]`)
  if (!(annaChip instanceof HTMLElement) && enabledBySource.anna) {
    annaChip = makeChip("anna", searchQuery)
  }
  if (annaChip instanceof HTMLElement && enabledBySource.anna) {
    annaChip.setAttribute("data-search-query", searchQuery)
    orderedChips.push(annaChip)
  }

  let audiobookbayChip = wrap.querySelector(`[${CHIP_ATTR}="audiobookbay"]`)
  if (!(audiobookbayChip instanceof HTMLElement) && enabledBySource.audiobookbay) {
    audiobookbayChip = makeChip("audiobookbay", bookTitle)
  }
  if (audiobookbayChip instanceof HTMLElement && enabledBySource.audiobookbay) {
    audiobookbayChip.setAttribute("data-search-query", bookTitle)
    orderedChips.push(audiobookbayChip)
  }

  let gutenbergChip = wrap.querySelector(`[${CHIP_ATTR}="gutenberg"]`)
  if (!(gutenbergChip instanceof HTMLElement) && enabledBySource.gutenberg) {
    gutenbergChip = makeChip("gutenberg", searchQuery)
  }
  if (gutenbergChip instanceof HTMLElement && enabledBySource.gutenberg) {
    gutenbergChip.setAttribute("data-search-query", searchQuery)
    orderedChips.push(gutenbergChip)
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

const enabledBySource: Record<SourceKey, boolean> = {
  zlib: true,
  anna: true,
  audiobookbay: true,
  gutenberg: true
}

const syncChipToState = () => {
  if (
    !enabledBySource.zlib &&
    !enabledBySource.anna &&
    !enabledBySource.audiobookbay &&
    !enabledBySource.gutenberg
  ) {
    removeChip()
    return
  }

  injectChips(enabledBySource)
}

const initializeEnabledState = () => {
  chrome.storage.sync.get(
    [
      ZLIB_ENABLED_KEY,
      ANNA_ENABLED_KEY,
      AUDIOBOOKBAY_ENABLED_KEY,
      GUTENBERG_ENABLED_KEY,
      ZLIB_DOMAIN_KEY,
      ANNA_DOMAIN_KEY,
      AUDIOBOOKBAY_DOMAIN_KEY
    ],
    (result) => {
      const zlibStored = result[ZLIB_ENABLED_KEY]
      const annaStored = result[ANNA_ENABLED_KEY]
      const audiobookbayStored = result[AUDIOBOOKBAY_ENABLED_KEY]
      const gutenbergStored = result[GUTENBERG_ENABLED_KEY]
      const domainStored = result[ZLIB_DOMAIN_KEY]
      const annaDomainStored = result[ANNA_DOMAIN_KEY]
      const audiobookbayDomainStored = result[AUDIOBOOKBAY_DOMAIN_KEY]

      enabledBySource.zlib = typeof zlibStored === "boolean" ? zlibStored : true
      enabledBySource.anna = typeof annaStored === "boolean" ? annaStored : true
      enabledBySource.audiobookbay =
        typeof audiobookbayStored === "boolean" ? audiobookbayStored : true
      enabledBySource.gutenberg =
        typeof gutenbergStored === "boolean" ? gutenbergStored : true

      if (domainStored) {
        currentZlibDomain = domainStored
      }
      if (annaDomainStored) {
        currentAnnaDomain = annaDomainStored
      }
      if (audiobookbayDomainStored) {
        currentAudiobookbayDomain = normalizeAudiobookbayDomain(audiobookbayDomainStored)
      }

      syncChipToState()
    }
  )
}

initializeEnabledState()

let injectTimeout: ReturnType<typeof setTimeout> | null = null
let lastUrl = window.location.href

const handleDomChange = () => {
  if (
    !enabledBySource.zlib &&
    !enabledBySource.anna &&
    !enabledBySource.audiobookbay &&
    !enabledBySource.gutenberg
  ) {
    return
  }

  if (injectTimeout) {
    clearTimeout(injectTimeout)
  }

  injectTimeout = setTimeout(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href
      removeChip()
    }
    injectChips(enabledBySource)
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
    currentZlibDomain = changes[ZLIB_DOMAIN_KEY].newValue || DEFAULT_DOMAIN
  }
  if (ANNA_DOMAIN_KEY in changes) {
    currentAnnaDomain = changes[ANNA_DOMAIN_KEY].newValue || DEFAULT_ANNA_DOMAIN
  }
  if (AUDIOBOOKBAY_DOMAIN_KEY in changes) {
    currentAudiobookbayDomain =
      normalizeAudiobookbayDomain(
        changes[AUDIOBOOKBAY_DOMAIN_KEY].newValue || DEFAULT_AUDIOBOOKBAY_DOMAIN
      )
  }

  if (ZLIB_ENABLED_KEY in changes) {
    const zlibNext = changes[ZLIB_ENABLED_KEY].newValue
    enabledBySource.zlib = typeof zlibNext === "boolean" ? zlibNext : true
  }
  if (ANNA_ENABLED_KEY in changes) {
    const annaNext = changes[ANNA_ENABLED_KEY].newValue
    enabledBySource.anna = typeof annaNext === "boolean" ? annaNext : true
  }
  if (AUDIOBOOKBAY_ENABLED_KEY in changes) {
    const audiobookbayNext = changes[AUDIOBOOKBAY_ENABLED_KEY].newValue
    enabledBySource.audiobookbay =
      typeof audiobookbayNext === "boolean" ? audiobookbayNext : true
  }
  if (GUTENBERG_ENABLED_KEY in changes) {
    const gutenbergNext = changes[GUTENBERG_ENABLED_KEY].newValue
    enabledBySource.gutenberg =
      typeof gutenbergNext === "boolean" ? gutenbergNext : true
  }
  syncChipToState()
})
