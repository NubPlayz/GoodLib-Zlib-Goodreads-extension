import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { FilterOption } from "./search-filters"
import "./MultiSelectDropdown.css"

interface MultiSelectDropdownProps {
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  label?: string
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "All Formats",
  searchPlaceholder = "Search...",
  label
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchInputId = useId()
  const labelId = useId()
  const summaryId = useId()

  const selectedSet = useMemo(() => new Set(selected), [selected])

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return options
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery("")
    }
  }, [isOpen])

  const toggleOption = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleSelectAll = () => {
    const allFilteredValues = filteredOptions.map((o) => o.value)
    const combined = Array.from(new Set([...selected, ...allFilteredValues]))
    onChange(combined)
  }

  const handleClearAll = () => {
    if (searchQuery.trim()) {
      const filteredValuesSet = new Set(filteredOptions.map((o) => o.value))
      onChange(selected.filter((v) => !filteredValuesSet.has(v)))
    } else {
      onChange([])
    }
  }

  const triggerSummary = useMemo(() => {
    if (selected.length === 0) {
      return placeholder
    }
    if (selected.length <= 3) {
      const selectedLabels = options
        .filter((opt) => selectedSet.has(opt.value))
        .map((opt) => opt.label.replace(/\s*\([^)]*\)$/, ""))
      return selectedLabels.join(", ")
    }
    return `${selected.length} selected`
  }, [selected, selectedSet, options, placeholder])

  return (
    <div className="multiselect-container" ref={dropdownRef}>
      {label && (
        <label id={labelId} className="multiselect-label">
          {label}
        </label>
      )}

      <button
        type="button"
        className={`multiselect-trigger ${isOpen ? "multiselect-trigger--open" : ""} ${
          selected.length > 0 ? "multiselect-trigger--active" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${labelId} ${summaryId}` : undefined}
      >
        <span id={summaryId} className="multiselect-trigger-text">{triggerSummary}</span>
        {selected.length > 0 && (
          <span className="multiselect-count-badge">{selected.length}</span>
        )}
        <span className={`multiselect-chevron ${isOpen ? "multiselect-chevron--up" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="multiselect-popover" role="dialog">
          <div className="multiselect-search-bar">
            <input
              id={searchInputId}
              name="multiselect-search"
              ref={searchInputRef}
              type="text"
              className="multiselect-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
            {searchQuery && (
              <button
                type="button"
                className="multiselect-search-clear"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="multiselect-actions-bar">
            <div className="multiselect-buttons">
              <button
                type="button"
                className="multiselect-btn multiselect-btn--select"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                type="button"
                className="multiselect-btn multiselect-btn--clear"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
            <span className="multiselect-stats">
              {selected.length} of {options.length}
            </span>
          </div>

          <div className="multiselect-options-list" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="multiselect-no-options">No matches found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isChecked = selectedSet.has(opt.value)
                return (
                  <label
                    key={opt.value}
                    className={`multiselect-option-item ${isChecked ? "multiselect-option-item--selected" : ""
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="multiselect-checkbox"
                      checked={isChecked}
                      onChange={() => toggleOption(opt.value)}
                    />
                    <span className="multiselect-option-label">{opt.label}</span>
                  </label>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

