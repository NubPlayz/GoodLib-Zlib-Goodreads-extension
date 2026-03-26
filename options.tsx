import { useEffect, useState } from "react"
import "./options.css"
import {
  ANNA_DOMAIN_KEY,
  DEFAULT_ANNA_DOMAIN,
  DEFAULT_ZLIB_DOMAIN,
  ZLIB_DOMAIN_KEY
} from "./sources"

const domains = [
  "z-library.gs",
  "1lib.sk",
  "z-lib.fm",
  "z-lib.gd",
  "z-lib.gl",
  "zliba.ru",
  "z-lib.sk",
  "z-library.ec"
]

const annaDomains = [
  "annas-archive.gd",
  "annas-archive.gl",
  "annas-archive.pk"
]

function OptionsIndex() {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_ZLIB_DOMAIN)
  const [selectedAnnaDomain, setSelectedAnnaDomain] = useState(DEFAULT_ANNA_DOMAIN)

  useEffect(() => {
    chrome.storage.sync.get([ZLIB_DOMAIN_KEY, ANNA_DOMAIN_KEY], (res) => {
      if (res[ZLIB_DOMAIN_KEY]) setSelectedDomain(res[ZLIB_DOMAIN_KEY])
      if (res[ANNA_DOMAIN_KEY]) setSelectedAnnaDomain(res[ANNA_DOMAIN_KEY])
    })
  }, [])

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain)
    chrome.storage.sync.set({ [ZLIB_DOMAIN_KEY]: domain })
  }

  const handleAnnaDomainChange = (domain: string) => {
    setSelectedAnnaDomain(domain)
    chrome.storage.sync.set({ [ANNA_DOMAIN_KEY]: domain })
  }

  return (
    <div className="options-container">
      <div className="options-card">
        <div className="header-small">Goodlib Preferences</div>
        <h1 className="title-main">GoodLIB</h1>
        <p className="last-updated">Customize domain.</p>

        <section className="mirror-selection">
          <h2>Z-Library Mirror</h2>
          <p className="description">Select the domain used to search for books on Z-Library.</p>
          <select
            value={selectedDomain}
            onChange={(e) => handleDomainChange(e.target.value)}
          >
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </section>

        <section className="mirror-selection">
          <h2>Anna's Archive Mirror</h2>
          <p className="description">Select the domain used to search for books on Anna's Archive.</p>
          <select
            value={selectedAnnaDomain}
            onChange={(e) => handleAnnaDomainChange(e.target.value)}
          >
            {annaDomains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </section>

        <footer className="footer">
          <p>Made with ❤️ by <a href="https://github.com/NubPlayz">NubPlayz</a></p>
        </footer>
      </div>
    </div>
  )
}

export default OptionsIndex
