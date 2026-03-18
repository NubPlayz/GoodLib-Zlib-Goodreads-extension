import { useEffect, useState } from "react"

import "./popup.css"

const ZLIB_ENABLED_KEY = "zlibEnabled"
const ANNA_ENABLED_KEY = "annaEnabled"
const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"

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
  }

  const handleAnnaToggleChange = (nextValue: boolean) => {
    setAnnaEnabled(nextValue)
    chrome.storage.sync.set({ [ANNA_ENABLED_KEY]: nextValue })
  }

  const handleGutenbergToggleChange = (nextValue: boolean) => {
    setGutenbergEnabled(nextValue)
    chrome.storage.sync.set({ [GUTENBERG_ENABLED_KEY]: nextValue })
  }

  return (
    <div className="popup">
      <h2 className="popup-title">Goodlib</h2>
      <div className="popup-card">
        <div className="popup-row">
          <div className="popup-avatar">
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
            <span className="popup-toggle-track" />
          </label>
        </div>

        <div className="popup-row">
          <div className="popup-avatar popup-avatar--anna">A</div>
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
            <span className="popup-toggle-track" />
          </label>
        </div>

        <div className="popup-row">
          <div className="popup-avatar popup-avatar--gutenberg">PG</div>
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
            <span className="popup-toggle-track" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
