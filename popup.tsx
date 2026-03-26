import { animate } from "animejs"

import "./popup.css"
import mascotCat from "./mascot cat.png"
import {
  ANNA_DOMAIN_KEY,
  DEFAULT_ANNA_DOMAIN,
  DEFAULT_ZLIB_DOMAIN,
  ZLIB_DOMAIN_KEY,
  sourceConfigByKey,
  sourceKeys
} from "./sources"
import type { SourceKey } from "./sources"

type SourceConfig = {
  avatarClassName?: string
  avatarText: string
  label: string
  rowClassName: string
  storageKey: string
  subtitle: string
  tagClassName: string
  trackClassName: string
}

type SourceElements = {
  input: HTMLInputElement
  row: HTMLDivElement
}

const sourceConfig: Record<SourceKey, SourceConfig> = {
  zlib: {
    avatarText: "Z",
    label: sourceConfigByKey.zlib.label,
    rowClassName: "anime-row-zlib",
    storageKey: sourceConfigByKey.zlib.enabledStorageKey,
    subtitle: DEFAULT_ZLIB_DOMAIN,
    tagClassName: "anime-tag-zlib",
    trackClassName: "zlib-switch"
  },
  anna: {
    avatarClassName: "popup-avatar--anna",
    avatarText: "A",
    label: sourceConfigByKey.anna.label,
    rowClassName: "anime-row-anna",
    storageKey: sourceConfigByKey.anna.enabledStorageKey,
    subtitle: DEFAULT_ANNA_DOMAIN,
    tagClassName: "anime-tag-anna",
    trackClassName: "anna-switch"
  },
  gutenberg: {
    avatarClassName: "popup-avatar--gutenberg",
    avatarText: "PG",
    label: "Project Gutenberg",
    rowClassName: "anime-row-gutenberg",
    storageKey: sourceConfigByKey.gutenberg.enabledStorageKey,
    subtitle: "gutenberg.org",
    tagClassName: "anime-tag-gutenberg",
    trackClassName: "gutenberg-switch"
  }
}

const sourceElements = {} as Record<SourceKey, SourceElements>

const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  textContent?: string
) => {
  const element = document.createElement(tagName)
  if (className) {
    element.className = className
  }
  if (textContent !== undefined) {
    element.textContent = textContent
  }
  return element
}

const applySourceState = (source: SourceKey, isEnabled: boolean) => {
  const elements = sourceElements[source]
  if (!elements) {
    return
  }

  elements.input.checked = isEnabled
  elements.row.classList.toggle("popup-row--off", !isEnabled)
}

const runToggleAnimation = (source: SourceKey, isEnabled: boolean) => {
  animate(`.anime-row-${source}`, {
    scale: [1, 0.96, 1],
    duration: 400,
    easing: "easeOutBack"
  })

  animate(`.anime-tag-${source}`, {
    rotate: isEnabled ? "1turn" : "-1turn",
    scale: isEnabled ? [1, 1.4, 1] : [1, 0.8, 1],
    duration: 800,
    easing: "easeOutElastic(1, .5)"
  })
}

const createActionLink = (label: string, href: string, leadingText?: string) => {
  const link = createElement("a", "popup-action-btn")
  link.href = href
  link.target = "_blank"
  link.rel = "noopener noreferrer"

  if (leadingText) {
    const leading = createElement("span", "popup-action-star", leadingText)
    leading.setAttribute("aria-hidden", "true")
    link.appendChild(leading)
  }

  link.appendChild(createElement("span", undefined, label))

  return link
}

const createSettingsBtn = () => {
  const btn = createElement("button", "popup-action-btn popup-settings-btn")

  const icon = createElement("span", "popup-action-star", "⚙")
  icon.setAttribute("aria-hidden", "true")

  btn.append(icon, createElement("span", undefined, "Settings"))

  btn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage()
    window.close()
  })

  return btn
}

const createPopupRow = (source: SourceKey) => {
  const config = sourceConfig[source]
  const row = createElement("div", `popup-row ${config.rowClassName}`)

  const avatarClassName = [
    "popup-avatar",
    config.avatarClassName,
    config.tagClassName
  ]
    .filter(Boolean)
    .join(" ")

  const avatar = createElement("div", avatarClassName, config.avatarText)

  const copy = createElement("div", "popup-copy")
  copy.append(
    createElement("div", "popup-name", config.label),
    createElement("div", "popup-subtitle", config.subtitle)
  )

  const toggle = createElement("label", "popup-toggle")
  const input = createElement("input") as HTMLInputElement
  input.type = "checkbox"
  input.checked = true
  input.addEventListener("change", () => {
    const nextValue = input.checked
    applySourceState(source, nextValue)
    chrome.storage.sync.set({ [config.storageKey]: nextValue })
    runToggleAnimation(source, nextValue)
  })

  const track = createElement("span", `popup-toggle-track ${config.trackClassName}`)
  toggle.append(input, track)

  row.append(avatar, copy, toggle)
  sourceElements[source] = { input, row }

  return row
}

const syncFromStorage = () => {
  chrome.storage.sync.get(
    [...sourceKeys.map((source) => sourceConfig[source].storageKey), ZLIB_DOMAIN_KEY, ANNA_DOMAIN_KEY],
    (result) => {

      const zlibSubtitle = sourceElements.zlib?.row.querySelector(".popup-subtitle")
      if (zlibSubtitle) {
        zlibSubtitle.textContent = result[ZLIB_DOMAIN_KEY] || DEFAULT_ZLIB_DOMAIN
      }

      const annaSubtitle = sourceElements.anna?.row.querySelector(".popup-subtitle")
      if (annaSubtitle) {
        annaSubtitle.textContent = result[ANNA_DOMAIN_KEY] || DEFAULT_ANNA_DOMAIN
      }

      for (const source of sourceKeys) {
        const storedValue = result[sourceConfig[source].storageKey]
        applySourceState(source, typeof storedValue === "boolean" ? storedValue : true)
      }
    }
  )
}

const mountPopup = () => {
  const root = document.getElementById("__plasmo")
  if (!(root instanceof HTMLElement) || root.childElementCount > 0) {
    return
  }

  const popup = createElement("div", "popup")

  const header = createElement("div", "popup-header")
  const title = createElement("h2", "popup-title")
  title.append(
    createElement("span", "popup-title-base", "Good"),
    createElement("span", "popup-title-l", "L"),
    createElement("span", "popup-title-i", "I"),
    createElement("span", "popup-title-b", "B")
  )

  const mascotWrap = createElement("div", "popup-mascot")
  mascotWrap.setAttribute("aria-label", "Goodlib mascot cat")
  mascotWrap.title = "Mascot"

  const mascotImage = createElement("img", "popup-mascot-image") as HTMLImageElement
  mascotImage.src = mascotCat
  mascotImage.alt = "Mascot cat"
  mascotWrap.appendChild(mascotImage)

  header.append(title, mascotWrap)

  const card = createElement("div", "popup-card")
  for (const source of sourceKeys) {
    card.appendChild(createPopupRow(source))
  }

  const footer = createElement("div", "popup-footer")
  const helpText = createElement("div", "popup-subtitle popup-footer-help", "Link not working? check settings!")

  footer.append(
    helpText,
    createActionLink(
      "GitHub",
      "https://github.com/NubPlayz/GoodLib-Zlib-Goodreads-extension",
      "*"
    ),
    createActionLink("Site", "https://goodlib.vercel.app"),
    createSettingsBtn()
  )

  popup.append(header, card, footer)
  root.appendChild(popup)

  syncFromStorage()

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") {
      return
    }

    if (ZLIB_DOMAIN_KEY in changes) {
      const zlibSubtitle = sourceElements.zlib?.row.querySelector(".popup-subtitle")
      if (zlibSubtitle) {
        zlibSubtitle.textContent = changes[ZLIB_DOMAIN_KEY].newValue || DEFAULT_ZLIB_DOMAIN
      }
    }

    if (ANNA_DOMAIN_KEY in changes) {
      const annaSubtitle = sourceElements.anna?.row.querySelector(".popup-subtitle")
      if (annaSubtitle) {
        annaSubtitle.textContent = changes[ANNA_DOMAIN_KEY].newValue || DEFAULT_ANNA_DOMAIN
      }
    }

    for (const source of sourceKeys) {
      const change = changes[sourceConfig[source].storageKey]
      if (!change) {
        continue
      }

      applySourceState(
        source,
        typeof change.newValue === "boolean" ? change.newValue : true
      )
    }
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountPopup, { once: true })
} else {
  mountPopup()
}
