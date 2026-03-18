import "./content.css"

export const config = {
  matches: ["https://www.goodreads.com/book/*"]
}

const CHIP_ATTR = "data-goodlib-zlib-chip"
const CHIP_CLASS = "goodlib-chip"

const titleSelectors = [
  "h1[data-testid='bookTitle']",
  "h1.Text__title1",
  "h1"
]

const contributorSelectors = [
  "a.ContributorLink",
  "span.ContributorLink__name",
  "a[data-testid='name']",
  "[data-testid='authorName']"
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

const getContributorText = (): string[] => {
  const values = new Set<string>()

  for (const selector of contributorSelectors) {
    const nodes = document.querySelectorAll(selector)
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue
      const text = normalizeText(node.innerText)
      if (text.length > 0) {
        values.add(text)
      }
    }
  }

  return [...values]
}

const injectChip = () => {
  const title = getBookTitle()
  if (!title) return

  if (title.querySelector(`[${CHIP_ATTR}]`)) return

  const bookTitle = normalizeText(title.textContent ?? "")
  if (!bookTitle) return

  const contributors = getContributorText()
  const queryParts = [bookTitle, ...contributors].filter(Boolean)
  const searchQuery = queryParts.join(" ")

  const chip = document.createElement("span")
  chip.setAttribute(CHIP_ATTR, "true")
  chip.className = CHIP_CLASS
  chip.textContent = "Z-Lib"
  chip.addEventListener("click", () => {
    const query = encodeURIComponent(searchQuery)
    window.location.assign(`https://z-lib.gl/s/${query}`)
  })

  title.appendChild(chip)
}

injectChip()

let injectTimeout: ReturnType<typeof setTimeout> | null = null

const observer = new MutationObserver(() => {
  if (injectTimeout) {
    clearTimeout(injectTimeout)
  }

  injectTimeout = setTimeout(() => {
    injectChip()
  }, 120)
})

observer.observe(document.body, { childList: true, subtree: true })
