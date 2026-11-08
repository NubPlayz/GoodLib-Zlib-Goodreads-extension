import { useEffect, useState } from "react"
import { MultiSelectDropdown } from "./MultiSelectDropdown"
import "./options.css"
import {
  ANNA_DOMAIN_KEY,
  ANNA_FILTERS_KEY,
  ANNA_FORMATS,
  ANNA_LANGUAGE_OPTIONS,
  ANNA_SORT_OPTIONS,
  AUDIOBOOKBAY_DOMAIN_KEY,
  DEFAULT_ANNA_DOMAIN,
  DEFAULT_AUDIOBOOKBAY_DOMAIN,
  DEFAULT_ZLIB_DOMAIN,
  ZLIB_DOMAIN_KEY,
  ZLIB_FILTERS_KEY,
  ZLIB_FORMATS,
  ZLIB_LANGUAGE_OPTIONS,
  ZLIB_SORT_OPTIONS,
  type AnnaPreferences,
  type ZlibPreferences
} from "./search-filters"

const domains = [
  "z-lib.sk",
  "z-library.im",
  "z-library.sk",
  "z-lib.fm",
  "1lib.sk",
  "z-lib.gd",
  "z-lib.gl",
  "z-lib.by",
  "z-library.website",
  "zlib.bz",
  "z-library.qa",
  "z-library.ec"
]

const annaDomains = [
  "annas-archive.gd",
  "annas-archive.gl",
  "annas-archive.pk"
]

const audiobookbayDomains = [
  "https://audiobookbay.lu"
]

const formatDomainLabel = (domain: string) => domain.replace(/^https?:\/\//, "")

const annaFormatOptions = ANNA_FORMATS.map((ext) => ({
  value: ext,
  label: ext
}))

const zlibFormatOptions = ZLIB_FORMATS.map((ext) => ({
  value: ext,
  label: ext
}))

function OptionsIndex() {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_ZLIB_DOMAIN)
  const [selectedAnnaDomain, setSelectedAnnaDomain] = useState(DEFAULT_ANNA_DOMAIN)
  const [selectedAudiobookbayDomain, setSelectedAudiobookbayDomain] = useState(
    DEFAULT_AUDIOBOOKBAY_DOMAIN
  )

  const [annaFilters, setAnnaFilters] = useState<AnnaPreferences>({
    sort: undefined,
    formats: [],
    languages: []
  })

  const [zlibFilters, setZlibFilters] = useState<ZlibPreferences>({
    order: undefined,
    formats: [],
    languages: []
  })

  const [isAnnaAdvancedOpen, setIsAnnaAdvancedOpen] = useState(false)
  const [isZlibAdvancedOpen, setIsZlibAdvancedOpen] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(
      [
        ZLIB_DOMAIN_KEY,
        ANNA_DOMAIN_KEY,
        AUDIOBOOKBAY_DOMAIN_KEY,
        ANNA_FILTERS_KEY,
        ZLIB_FILTERS_KEY
      ],
      (res) => {
        if (res[ZLIB_DOMAIN_KEY]) setSelectedDomain(res[ZLIB_DOMAIN_KEY])
        if (res[ANNA_DOMAIN_KEY]) setSelectedAnnaDomain(res[ANNA_DOMAIN_KEY])
        if (res[AUDIOBOOKBAY_DOMAIN_KEY]) {
          setSelectedAudiobookbayDomain(res[AUDIOBOOKBAY_DOMAIN_KEY])
        }
        if (res[ANNA_FILTERS_KEY]) {
          setAnnaFilters({
            sort: res[ANNA_FILTERS_KEY].sort,
            formats: Array.isArray(res[ANNA_FILTERS_KEY].formats)
              ? res[ANNA_FILTERS_KEY].formats
              : [],
            languages: Array.isArray(res[ANNA_FILTERS_KEY].languages)
              ? res[ANNA_FILTERS_KEY].languages
              : []
          })
        }
        if (res[ZLIB_FILTERS_KEY]) {
          setZlibFilters({
            order: res[ZLIB_FILTERS_KEY].order,
            formats: Array.isArray(res[ZLIB_FILTERS_KEY].formats)
              ? res[ZLIB_FILTERS_KEY].formats
              : [],
            languages: Array.isArray(res[ZLIB_FILTERS_KEY].languages)
              ? res[ZLIB_FILTERS_KEY].languages
              : []
          })
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

  const updateAnnaFilters = (updates: Partial<AnnaPreferences>) => {
    const next = { ...annaFilters, ...updates }
    setAnnaFilters(next)
    chrome.storage.sync.set({ [ANNA_FILTERS_KEY]: next })
  }

  const updateZlibFilters = (updates: Partial<ZlibPreferences>) => {
    const next = { ...zlibFilters, ...updates }
    setZlibFilters(next)
    chrome.storage.sync.set({ [ZLIB_FILTERS_KEY]: next })
  }

  const handleResetAnnaFilters = () => {
    const defaultFilters: AnnaPreferences = {
      sort: undefined,
      formats: [],
      languages: []
    }
    setAnnaFilters(defaultFilters)
    chrome.storage.sync.set({ [ANNA_FILTERS_KEY]: defaultFilters })
  }

  const handleResetZlibFilters = () => {
    const defaultFilters: ZlibPreferences = {
      order: undefined,
      formats: [],
      languages: []
    }
    setZlibFilters(defaultFilters)
    chrome.storage.sync.set({ [ZLIB_FILTERS_KEY]: defaultFilters })
  }

  return (
    <div className="options-container">
      <div className="options-card">
        <div className="header-small">Goodlib Preferences</div>
        <h1 className="title-main">GoodLIB</h1>
        <p className="last-updated">Customize source domains and search filters.</p>
        <section className="settings-section">
          <div className="section-header">
            <h2>Anna's Archive Settings</h2>
          </div>
          <p className="description">
            Configure mirror domain and custom search filters for Anna's Archive.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="anna-domain-select">Mirror Domain</label>
            <select
              id="anna-domain-select"
              value={selectedAnnaDomain}
              onChange={(e) => handleAnnaDomainChange(e.target.value)}
            >
              {annaDomains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className={`advanced-filters-box ${isAnnaAdvancedOpen ? "advanced-filters-box--open" : ""}`}>
            <div className="advanced-filters-header">
              <button
                type="button"
                className="advanced-filters-toggle"
                onClick={() => setIsAnnaAdvancedOpen((prev) => !prev)}
                aria-expanded={isAnnaAdvancedOpen}
              >
                <span className={`advanced-filters-chevron ${isAnnaAdvancedOpen ? "advanced-filters-chevron--open" : ""}`}>
                  ▶
                </span>
                <span className="advanced-filters-title">Advanced Search Filters</span>
              </button>

              {isAnnaAdvancedOpen && (
                <button
                  type="button"
                  className="reset-section-btn"
                  onClick={handleResetAnnaFilters}
                  title="Reset Anna's Archive filters to default"
                >
                  Revert to Default
                </button>
              )}
            </div>

            {isAnnaAdvancedOpen && (
              <div className="advanced-filters-content">
                <div className="form-group">
                  <label className="form-label" htmlFor="anna-sort-select">Sort By</label>
                  <select
                    id="anna-sort-select"
                    value={annaFilters.sort ?? ""}
                    onChange={(e) => updateAnnaFilters({ sort: e.target.value })}
                  >
                    {ANNA_SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <MultiSelectDropdown
                  label="File Formats"
                  options={annaFormatOptions}
                  selected={annaFilters.formats || []}
                  onChange={(formats) => updateAnnaFilters({ formats })}
                  placeholder="All Formats"
                  searchPlaceholder="Search formats (e.g. epub, pdf)..."
                />

                <MultiSelectDropdown
                  label="Languages"
                  options={ANNA_LANGUAGE_OPTIONS}
                  selected={annaFilters.languages || []}
                  onChange={(languages) => updateAnnaFilters({ languages })}
                  placeholder="All Languages"
                  searchPlaceholder="Search languages (e.g. English, French, zh)..."
                />
              </div>
            )}
          </div>
        </section>

        <section className="settings-section">
          <div className="section-header">
            <h2>Z-Library Settings</h2>
          </div>
          <p className="description">
            Configure mirror domain and custom search filters for Z-Library.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="zlib-domain-select">Mirror Domain</label>
            <select
              id="zlib-domain-select"
              value={selectedDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className={`advanced-filters-box ${isZlibAdvancedOpen ? "advanced-filters-box--open" : ""}`}>
            <div className="advanced-filters-header">
              <button
                type="button"
                className="advanced-filters-toggle"
                onClick={() => setIsZlibAdvancedOpen((prev) => !prev)}
                aria-expanded={isZlibAdvancedOpen}
              >
                <span className={`advanced-filters-chevron ${isZlibAdvancedOpen ? "advanced-filters-chevron--open" : ""}`}>
                  ▶
                </span>
                <span className="advanced-filters-title">Advanced Search Filters</span>
              </button>

              {isZlibAdvancedOpen && (
                <button
                  type="button"
                  className="reset-section-btn"
                  onClick={handleResetZlibFilters}
                  title="Reset Z-Library filters to default"
                >
                  Revert to Default
                </button>
              )}
            </div>

            {isZlibAdvancedOpen && (
              <div className="advanced-filters-content">
                <div className="form-group">
                  <label className="form-label" htmlFor="zlib-sort-select">Sort By</label>
                  <select
                    id="zlib-sort-select"
                    value={zlibFilters.order ?? "bestmatch"}
                    onChange={(e) => updateZlibFilters({ order: e.target.value })}
                  >
                    {ZLIB_SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <MultiSelectDropdown
                  label="File Formats"
                  options={zlibFormatOptions}
                  selected={zlibFilters.formats || []}
                  onChange={(formats) => updateZlibFilters({ formats })}
                  placeholder="All Formats"
                  searchPlaceholder="Search formats (e.g. EPUB, PDF)..."
                />

                <MultiSelectDropdown
                  label="Languages"
                  options={ZLIB_LANGUAGE_OPTIONS}
                  selected={zlibFilters.languages || []}
                  onChange={(languages) => updateZlibFilters({ languages })}
                  placeholder="All Languages"
                  searchPlaceholder="Search languages (e.g. English, Traditional Chinese)..."
                />
              </div>
            )}
          </div>
        </section>

        <section className="settings-section">
          <div className="section-header">
            <h2>AudiobookBay Mirror</h2>
          </div>
          <p className="description">Select the domain used to search for books on AudiobookBay.</p>
          <div className="form-group">
            <select
              id="audiobookbay-domain-select"
              value={selectedAudiobookbayDomain}
              onChange={(e) => handleAudiobookbayDomainChange(e.target.value)}
            >
              {audiobookbayDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {formatDomainLabel(domain)}
                </option>
              ))}
            </select>
          </div>
        </section>

        <footer className="footer">
          <p>
            Made with ❤️ by <a href="https://github.com/NubPlayz">NubPlayz</a>
          </p>
          <p className="footer-feedback">
            Facing an issue, want to suggest something, or found a broken mirror link?{" "}
            <a
              href="https://forms.gle/2Khb8czfxLUgE1F78"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use this google form to report
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default OptionsIndex
