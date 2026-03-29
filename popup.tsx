import { animate } from "animejs"
import { useEffect, useState, type ChangeEvent } from "react"

import "./popup.css"
import mascotCat from "./mascot cat.png"

const ZLIB_ENABLED_KEY = "zlibEnabled"
const ANNA_ENABLED_KEY = "annaEnabled"
const AUDIOBOOKBAY_ENABLED_KEY = "audiobookbayEnabled"
const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"
const ZLIB_DOMAIN_KEY = "zlibDomain"
const DEFAULT_DOMAIN = "z-library.gs"
const ANNA_DOMAIN_KEY = "annaDomain"
const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
const AUDIOBOOKBAY_DOMAIN_KEY = "audiobookbayDomain"
const DEFAULT_AUDIOBOOKBAY_DOMAIN = "https://audiobookbay.lu"

type SourceKey = "zlib" | "anna" | "audiobookbay" | "gutenberg"

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

type SourceState = Record<SourceKey, boolean>
type SubtitleState = Record<SourceKey, string>

const sourceConfig: Record<SourceKey, SourceConfig> = {
  zlib: {
    avatarText: "Z",
    label: "Z-Lib",
    rowClassName: "anime-row-zlib",
    storageKey: ZLIB_ENABLED_KEY,
    subtitle: "z-lib.gl",
    tagClassName: "anime-tag-zlib",
    trackClassName: "zlib-switch"
  },
  anna: {
    avatarClassName: "popup-avatar--anna",
    avatarText: "A",
    label: "Anna's",
    rowClassName: "anime-row-anna",
    storageKey: ANNA_ENABLED_KEY,
    subtitle: "annas-archive.gd",
    tagClassName: "anime-tag-anna",
    trackClassName: "anna-switch"
  },
  audiobookbay: {
    avatarClassName: "popup-avatar--audiobookbay",
    avatarText: "AB",
    label: "AudiobookBay",
    rowClassName: "anime-row-audiobookbay",
    storageKey: AUDIOBOOKBAY_ENABLED_KEY,
    subtitle: "audiobookbay.lu",
    tagClassName: "anime-tag-audiobookbay",
    trackClassName: "audiobookbay-switch"
  },
  gutenberg: {
    avatarClassName: "popup-avatar--gutenberg",
    avatarText: "PG",
    label: "Project Gutenberg",
    rowClassName: "anime-row-gutenberg",
    storageKey: GUTENBERG_ENABLED_KEY,
    subtitle: "gutenberg.org",
    tagClassName: "anime-tag-gutenberg",
    trackClassName: "gutenberg-switch"
  }
}

const sourceKeys: SourceKey[] = ["zlib", "anna", "audiobookbay", "gutenberg"]

const defaultSourceState: SourceState = {
  zlib: true,
  anna: true,
  audiobookbay: true,
  gutenberg: true
}

const defaultSubtitles: SubtitleState = {
  zlib: DEFAULT_DOMAIN,
  anna: DEFAULT_ANNA_DOMAIN,
  audiobookbay: "audiobookbay.lu",
  gutenberg: sourceConfig.gutenberg.subtitle
}

const formatDomainSubtitle = (value: string) =>
  value.replace(/^https?:\/\//, "").replace(/\/+$/, "")

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

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean"
const isString = (value: unknown): value is string => typeof value === "string"

const getSourceStateFromStorage = (result: Record<string, unknown>): SourceState => ({
  zlib: isBoolean(result[ZLIB_ENABLED_KEY]) ? result[ZLIB_ENABLED_KEY] : defaultSourceState.zlib,
  anna: isBoolean(result[ANNA_ENABLED_KEY]) ? result[ANNA_ENABLED_KEY] : defaultSourceState.anna,
  audiobookbay: isBoolean(result[AUDIOBOOKBAY_ENABLED_KEY])
    ? result[AUDIOBOOKBAY_ENABLED_KEY]
    : defaultSourceState.audiobookbay,
  gutenberg: isBoolean(result[GUTENBERG_ENABLED_KEY])
    ? result[GUTENBERG_ENABLED_KEY]
    : defaultSourceState.gutenberg
})

const getSubtitlesFromStorage = (result: Record<string, unknown>): SubtitleState => ({
  zlib: isString(result[ZLIB_DOMAIN_KEY]) ? result[ZLIB_DOMAIN_KEY] : DEFAULT_DOMAIN,
  anna: isString(result[ANNA_DOMAIN_KEY]) ? result[ANNA_DOMAIN_KEY] : DEFAULT_ANNA_DOMAIN,
  audiobookbay: formatDomainSubtitle(
    isString(result[AUDIOBOOKBAY_DOMAIN_KEY])
      ? result[AUDIOBOOKBAY_DOMAIN_KEY]
      : DEFAULT_AUDIOBOOKBAY_DOMAIN
  ),
  gutenberg: sourceConfig.gutenberg.subtitle
})

function Popup() {
  const [sourceState, setSourceState] = useState<SourceState>(() => ({ ...defaultSourceState }))
  const [subtitles, setSubtitles] = useState<SubtitleState>(() => ({ ...defaultSubtitles }))

  useEffect(() => {
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
        setSourceState(getSourceStateFromStorage(result))
        setSubtitles(getSubtitlesFromStorage(result))
      }
    )

    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName !== "sync") {
        return
      }

      setSourceState((currentState) => {
        let didChange = false
        const nextState = { ...currentState }

        for (const source of sourceKeys) {
          const change = changes[sourceConfig[source].storageKey]
          if (!change) {
            continue
          }

          nextState[source] = isBoolean(change.newValue)
            ? change.newValue
            : defaultSourceState[source]
          didChange = true
        }

        return didChange ? nextState : currentState
      })

      setSubtitles((currentSubtitles) => {
        let didChange = false
        const nextSubtitles = { ...currentSubtitles }

        if (ZLIB_DOMAIN_KEY in changes) {
          nextSubtitles.zlib = isString(changes[ZLIB_DOMAIN_KEY].newValue)
            ? changes[ZLIB_DOMAIN_KEY].newValue
            : DEFAULT_DOMAIN
          didChange = true
        }

        if (ANNA_DOMAIN_KEY in changes) {
          nextSubtitles.anna = isString(changes[ANNA_DOMAIN_KEY].newValue)
            ? changes[ANNA_DOMAIN_KEY].newValue
            : DEFAULT_ANNA_DOMAIN
          didChange = true
        }

        if (AUDIOBOOKBAY_DOMAIN_KEY in changes) {
          nextSubtitles.audiobookbay = formatDomainSubtitle(
            isString(changes[AUDIOBOOKBAY_DOMAIN_KEY].newValue)
              ? changes[AUDIOBOOKBAY_DOMAIN_KEY].newValue
              : DEFAULT_AUDIOBOOKBAY_DOMAIN
          )
          didChange = true
        }

        return didChange ? nextSubtitles : currentSubtitles
      })
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const handleToggle =
    (source: SourceKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.checked

      setSourceState((currentState) => ({
        ...currentState,
        [source]: nextValue
      }))

      chrome.storage.sync.set({ [sourceConfig[source].storageKey]: nextValue })
      runToggleAnimation(source, nextValue)
    }

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage()
    window.close()
  }

  return (
    <div className="popup">
      <div className="popup-header">
        <h2 className="popup-title">
          <span className="popup-title-base">Good</span>
          <span className="popup-title-l">L</span>
          <span className="popup-title-i">I</span>
          <span className="popup-title-b">B</span>
        </h2>

        <div className="popup-mascot" aria-label="Goodlib mascot cat" title="Mascot">
          <img className="popup-mascot-image" src={mascotCat} alt="Mascot cat" />
        </div>
      </div>

      <div className="popup-card">
        {sourceKeys.map((source) => {
          const config = sourceConfig[source]
          const avatarClassName = [
            "popup-avatar",
            config.avatarClassName,
            config.tagClassName
          ]
            .filter(Boolean)
            .join(" ")

          return (
            <div
              key={source}
              className={`popup-row ${config.rowClassName}${sourceState[source] ? "" : " popup-row--off"}`}>
              <div className={avatarClassName}>{config.avatarText}</div>

              <div className="popup-copy">
                <div className="popup-name">{config.label}</div>
                <div className="popup-subtitle">{subtitles[source]}</div>
              </div>

              <label className="popup-toggle">
                <input
                  type="checkbox"
                  checked={sourceState[source]}
                  onChange={handleToggle(source)}
                />
                <span className={`popup-toggle-track ${config.trackClassName}`} />
              </label>
            </div>
          )
        })}
      </div>

      <div className="popup-footer">
        <div className="popup-subtitle popup-footer-help">Link not working? Check settings!</div>

        <a
          className="popup-action-btn"
          href="https://github.com/NubPlayz/GoodLib-Zlib-Goodreads-extension"
          target="_blank"
          rel="noopener noreferrer">
          <span className="popup-action-star" aria-hidden="true">
            *
          </span>
          <span>GitHub</span>
        </a>

        <a
          className="popup-action-btn"
          href="https://goodlib.vercel.app"
          target="_blank"
          rel="noopener noreferrer">
          <span>Site</span>
        </a>

        <button className="popup-action-btn popup-settings-btn" onClick={handleOpenSettings}>
          <span className="popup-action-star" aria-hidden="true">
                ⚙
          </span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}

export default Popup
