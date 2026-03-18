import { animate } from "animejs"
import { useEffect, useState } from "react"

import "./popup.css"

const ZLIB_ENABLED_KEY = "zlibEnabled"
const ANNA_ENABLED_KEY = "annaEnabled"
const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"
type SourceKey = "zlib" | "anna" | "gutenberg"

function IndexPopup() {
  const [zlibEnabled, setZlibEnabled] = useState(true)
  const [annaEnabled, setAnnaEnabled] = useState(true)
  const [gutenbergEnabled, setGutenbergEnabled] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(
      [ZLIB_ENABLED_KEY, ANNA_ENABLED_KEY, GUTENBERG_ENABLED_KEY],
      (result) => {
      const zlibStored = result[ZLIB_ENABLED_KEY]
      const annaStored = result[ANNA_ENABLED_KEY]
      const gutenbergStored = result[GUTENBERG_ENABLED_KEY]
      setZlibEnabled(typeof zlibStored === "boolean" ? zlibStored : true)
      setAnnaEnabled(typeof annaStored === "boolean" ? annaStored : true)
      setGutenbergEnabled(
        typeof gutenbergStored === "boolean" ? gutenbergStored : true
      )
    })
  }, [])

  const handleZlibToggleChange = (nextValue: boolean) => {
    setZlibEnabled(nextValue)
    chrome.storage.sync.set({ [ZLIB_ENABLED_KEY]: nextValue })
    runToggleAnimation("zlib", nextValue)
  }

  const handleAnnaToggleChange = (nextValue: boolean) => {
    setAnnaEnabled(nextValue)
    chrome.storage.sync.set({ [ANNA_ENABLED_KEY]: nextValue })
    runToggleAnimation("anna", nextValue)
  }

  const handleGutenbergToggleChange = (nextValue: boolean) => {
    setGutenbergEnabled(nextValue)
    chrome.storage.sync.set({ [GUTENBERG_ENABLED_KEY]: nextValue })
    runToggleAnimation("gutenberg", nextValue)
  }

  const runToggleAnimation = (key: SourceKey, isOn: boolean) => {
    animate(`.anime-row-${key}`, {
      scale: [1, 0.96, 1],
      duration: 400,
      easing: "easeOutBack"
    })

    animate(`.anime-tag-${key}`, {
      rotate: isOn ? "1turn" : "-1turn",
      scale: isOn ? [1, 1.4, 1] : [1, 0.8, 1],
      duration: 800,
      easing: "easeOutElastic(1, .5)"
    })
  }

  return (
    <div className="popup">
      <h2 className="popup-title">Goodlib</h2>
      <div className="popup-card">
        <div
          className={`popup-row anime-row-zlib ${!zlibEnabled ? "popup-row--off" : ""}`}>
          <div className="popup-avatar anime-tag-zlib">
            Z
          </div>
          <div className="popup-copy">
            <div className="popup-name">Z-Lib</div>
            <div className="popup-subtitle">z-lib.gl</div>
          </div>
          <label className="popup-toggle">
            <input
              type="checkbox"
              checked={zlibEnabled}
              onChange={(event) => handleZlibToggleChange(event.target.checked)}
            />
            <span className="popup-toggle-track zlib-switch" />
          </label>
        </div>

        <div
          className={`popup-row anime-row-anna ${!annaEnabled ? "popup-row--off" : ""}`}>
          <div className="popup-avatar popup-avatar--anna anime-tag-anna">A</div>
          <div className="popup-copy">
            <div className="popup-name">Anna&apos;s</div>
            <div className="popup-subtitle">annas-archive.gd</div>
          </div>
          <label className="popup-toggle popup-toggle--anna">
            <input
              type="checkbox"
              checked={annaEnabled}
              onChange={(event) => handleAnnaToggleChange(event.target.checked)}
            />
            <span className="popup-toggle-track anna-switch" />
          </label>
        </div>

        <div
          className={`popup-row anime-row-gutenberg ${!gutenbergEnabled ? "popup-row--off" : ""}`}>
          <div className="popup-avatar popup-avatar--gutenberg anime-tag-gutenberg">
            PG
          </div>
          <div className="popup-copy">
            <div className="popup-name">Project Gutenberg</div>
            <div className="popup-subtitle">gutenberg.org</div>
          </div>
          <label className="popup-toggle popup-toggle--gutenberg">
            <input
              type="checkbox"
              checked={gutenbergEnabled}
              onChange={(event) =>
                handleGutenbergToggleChange(event.target.checked)
              }
            />
            <span className="popup-toggle-track gutenberg-switch" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
