import { useEffect, useState } from "react"

import "./options.css"
import {
  ANNA_DOMAIN_KEY,
  CUSTOM_SOURCES_KEY,
  CUSTOM_SOURCE_IDS,
  DEFAULT_ANNA_DOMAIN,
  DEFAULT_ZLIB_DOMAIN,
  ZLIB_DOMAIN_KEY,
  toCustomSourceSlots,
  writeCustomSourcesToStorage
} from "./sources"
import type { CustomSourceSlot } from "./sources"

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

type CustomSourceDraft = {
  enabled: boolean
  label: string
  template: string
}

const createEmptyCustomSourceDraft = (): CustomSourceDraft => ({
  enabled: true,
  label: "",
  template: ""
})

function OptionsIndex() {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_ZLIB_DOMAIN)
  const [selectedAnnaDomain, setSelectedAnnaDomain] = useState(DEFAULT_ANNA_DOMAIN)
  const [customSources, setCustomSources] = useState<CustomSourceDraft[]>(
    CUSTOM_SOURCE_IDS.map(() => createEmptyCustomSourceDraft())
  )
  const [customSourceError, setCustomSourceError] = useState("")
  const [customSourceStatus, setCustomSourceStatus] = useState("")

  useEffect(() => {
    chrome.storage.sync.get(
      [ZLIB_DOMAIN_KEY, ANNA_DOMAIN_KEY, CUSTOM_SOURCES_KEY],
      (res) => {
        if (res[ZLIB_DOMAIN_KEY]) setSelectedDomain(res[ZLIB_DOMAIN_KEY])
        if (res[ANNA_DOMAIN_KEY]) setSelectedAnnaDomain(res[ANNA_DOMAIN_KEY])

        const sourceSlots = toCustomSourceSlots(res[CUSTOM_SOURCES_KEY])
        setCustomSources(
          CUSTOM_SOURCE_IDS.map((_, index) => sourceSlots[index] ?? createEmptyCustomSourceDraft())
        )
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

  const updateCustomSource = (
    index: number,
    field: keyof CustomSourceDraft,
    value: string | boolean
  ) => {
    setCustomSourceStatus("")
    setCustomSourceError("")
    setCustomSources((currentSources) =>
      currentSources.map((source, sourceIndex) =>
        sourceIndex === index ? { ...source, [field]: value } : source
      )
    )
  }

  const handleCustomSourceSave = async () => {
    const nextSlots: CustomSourceSlot[] = []

    for (const source of customSources) {
      const label = source.label.trim()
      const template = source.template.trim()

      if (!label && !template) {
        nextSlots.push(null)
        continue
      }

      if (!label || !template) {
        setCustomSourceError("Each custom source needs both a label and a template.")
        setCustomSourceStatus("")
        return
      }

      if (!template.includes("{{query}}")) {
        setCustomSourceError("Each custom source template must include {{query}}.")
        setCustomSourceStatus("")
        return
      }

      nextSlots.push({
        enabled: source.enabled,
        label,
        template
      })
    }

    await writeCustomSourcesToStorage(nextSlots)
    setCustomSourceStatus("Custom links saved.")
    setCustomSourceError("")
  }

  return (
    <div className="options-container">
      <div className="options-card">
        <div className="header-small">Goodlib Preferences</div>
        <h1 className="title-main">GoodLIB</h1>
        <p className="last-updated">Customize domains and custom links.</p>

        <section className="mirror-selection">
          <h2>Z-Library Mirror</h2>
          <p className="description">Select the domain used to search for books on Z-Library.</p>
          <select
            value={selectedDomain}
            onChange={(e) => handleDomainChange(e.target.value)}
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
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
            {annaDomains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </section>

        <section className="mirror-selection">
          <h2>Custom Sources</h2>
          <p className="description">Edit the two custom links shown in the popup.</p>

          {customSources.map((source, index) => (
            <div className="custom-source-card" key={CUSTOM_SOURCE_IDS[index]}>
              <div className="custom-source-header">
                <h3>Custom Link {index + 1}</h3>
                <span className="custom-source-note">Enabled in popup</span>
              </div>

              <label className="custom-source-field">
                <span>Label</span>
                <input
                  onChange={(e) => updateCustomSource(index, "label", e.target.value)}
                  placeholder="Internet Archive"
                  type="text"
                  value={source.label}
                />
              </label>

              <label className="custom-source-field">
                <span>Template</span>
                <textarea
                  onChange={(e) => updateCustomSource(index, "template", e.target.value)}
                  placeholder="https://archive.org/search?query={{query}}"
                  rows={3}
                  value={source.template}
                />
              </label>
            </div>
          ))}

          <div className="custom-source-actions">
            <button className="save-button" onClick={handleCustomSourceSave} type="button">
              Save Custom Links
            </button>
            {customSourceError ? (
              <p className="custom-source-message custom-source-message--error">
                {customSourceError}
              </p>
            ) : null}
            {customSourceStatus ? (
              <p className="custom-source-message">{customSourceStatus}</p>
            ) : null}
          </div>
        </section>

        <footer className="footer">
          <p>Made with ❤️ by <a href="https://github.com/NubPlayz">NubPlayz</a></p>
        </footer>
      </div>
    </div>
  )
}

export default OptionsIndex
