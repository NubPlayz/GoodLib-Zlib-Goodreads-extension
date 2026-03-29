import { useEffect, useState } from "react"
import "./options.css"

const ZLIB_DOMAIN_KEY = "zlibDomain"
const DEFAULT_DOMAIN = "1lib.sk"
const ANNA_DOMAIN_KEY = "annaDomain"
const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
const AUDIOBOOKBAY_DOMAIN_KEY = "audiobookbayDomain"
const DEFAULT_AUDIOBOOKBAY_DOMAIN = "https://audiobookbay.lu"

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

const audiobookbayDomains = [
  "https://audiobookbay.lu",
  "https://audiobookbay.li",
  "https://audiobookbay.fi",
  "https://audiobookbay.nl",
  "https://audiobookbay.is",
  "https://audiobookbay.se"
]

const formatDomainLabel = (domain: string) => domain.replace(/^https?:\/\//, "")

function OptionsIndex() {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN)
  const [selectedAnnaDomain, setSelectedAnnaDomain] = useState(DEFAULT_ANNA_DOMAIN)
  const [selectedAudiobookbayDomain, setSelectedAudiobookbayDomain] = useState(
    DEFAULT_AUDIOBOOKBAY_DOMAIN
  )

  useEffect(() => {
    chrome.storage.sync.get(
      [ZLIB_DOMAIN_KEY, ANNA_DOMAIN_KEY, AUDIOBOOKBAY_DOMAIN_KEY],
      (res) => {
        if (res[ZLIB_DOMAIN_KEY]) setSelectedDomain(res[ZLIB_DOMAIN_KEY])
        if (res[ANNA_DOMAIN_KEY]) setSelectedAnnaDomain(res[ANNA_DOMAIN_KEY])
        if (res[AUDIOBOOKBAY_DOMAIN_KEY]) {
          setSelectedAudiobookbayDomain(res[AUDIOBOOKBAY_DOMAIN_KEY])
        }
      }
    )
  }, [])

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain)
    chrome.storage.sync.set({ [ZLIB_DOMAIN_KEY]: domain })
  }

  const handleAnnaDomainChange = (domain: string) => {
    setSelectedAnnaDomain(domain)
    chrome.storage.sync.set({ [ANNA_DOMAIN_KEY]: domain })
  }

  const handleAudiobookbayDomainChange = (domain: string) => {
    setSelectedAudiobookbayDomain(domain)
    chrome.storage.sync.set({ [AUDIOBOOKBAY_DOMAIN_KEY]: domain })
  }

  return (
    <div className="options-container">
      <div className="options-card">
        <div className="header-small">Goodlib Preferences</div>
        <h1 className="title-main">GoodLIB</h1>
        <p className="last-updated">Customize source domains.</p>

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

        <section className="mirror-selection">
          <h2>AudiobookBay Mirror</h2>
          <p className="description">Select the domain used to search for books on AudiobookBay.</p>
          <select
            value={selectedAudiobookbayDomain}
            onChange={(e) => handleAudiobookbayDomainChange(e.target.value)}
          >
            {audiobookbayDomains.map((domain) => (
              <option key={domain} value={domain}>
                {formatDomainLabel(domain)}
              </option>
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
