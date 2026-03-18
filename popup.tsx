import "./popup.css"

function IndexPopup() {
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
            <input type="checkbox" defaultChecked  />
          </label>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
