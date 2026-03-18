import { useEffect, useState } from "react"

import "./popup.css"

const ZLIB_ENABLED_KEY = "zlibEnabled"

function IndexPopup() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(ZLIB_ENABLED_KEY, (result) => {
      const stored = result[ZLIB_ENABLED_KEY]
      setEnabled(typeof stored === "boolean" ? stored : true)
    })
  }, [])

  const handleToggleChange = (nextValue: boolean) => {
    setEnabled(nextValue)
    chrome.storage.sync.set({ [ZLIB_ENABLED_KEY]: nextValue })
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
              checked={enabled}
              onChange={(event) => handleToggleChange(event.target.checked)}
            />
            <span className="popup-toggle-track" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
