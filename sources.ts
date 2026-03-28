export const ZLIB_ENABLED_KEY = "zlibEnabled"
export const ANNA_ENABLED_KEY = "annaEnabled"
export const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"

export const ZLIB_DOMAIN_KEY = "zlibDomain"
export const DEFAULT_ZLIB_DOMAIN = "z-library.gs"
export const ANNA_DOMAIN_KEY = "annaDomain"
export const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
export const CUSTOM_SOURCES_KEY = "customSources"
export const MAX_CUSTOM_SOURCES = 2
export const CUSTOM_SOURCE_IDS = ["custom-1", "custom-2"] as const

export type SourceKey = "zlib" | "anna" | "gutenberg"
export type CustomSourceId = (typeof CUSTOM_SOURCE_IDS)[number]
export type SearchTemplateContext = {
  author: string
  query: string
  title: string
}

export type StoredCustomSource = {
  enabled: boolean
  id: CustomSourceId
  label: string
  template: string
}

export type CustomSourceSlot = {
  enabled: boolean
  label: string
  template: string
} | null

export const DEFAULT_CUSTOM_SOURCES: StoredCustomSource[] = [
  {
    enabled: true,
    id: "custom-1",
    label: "Internet Archive",
    template: "https://archive.org/search?query={{query}}"
  }
]

type SourceDefinition = {
  chipGlyph: string
  enabledStorageKey: string
  label: string
}

export const sourceList: Array<{ key: SourceKey } & SourceDefinition> = [
  {
    key: "zlib",
    chipGlyph: "z",
    enabledStorageKey: ZLIB_ENABLED_KEY,
    label: "Z-Lib"
  },
  {
    key: "anna",
    chipGlyph: "A",
    enabledStorageKey: ANNA_ENABLED_KEY,
    label: "Anna's"
  },
  {
    key: "gutenberg",
    chipGlyph: "PG",
    enabledStorageKey: GUTENBERG_ENABLED_KEY,
    label: "Gutenberg"
  }
]

export const sourceKeys = sourceList.map((source) => source.key)

export const sourceConfigByKey = Object.fromEntries(
  sourceList.map((source) => [source.key, source])
) as Record<SourceKey, SourceDefinition & { key: SourceKey }>

const readStorageString = (value: unknown) => (typeof value === "string" ? value.trim() : "")

export const normalizeCustomSources = (value: unknown): StoredCustomSource[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.slice(0, MAX_CUSTOM_SOURCES).flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") {
      return []
    }

    const label = readStorageString((entry as { label?: unknown }).label)
    const template = readStorageString((entry as { template?: unknown }).template)

    if (!label || !template) {
      return []
    }

    const enabledValue = (entry as { enabled?: unknown }).enabled

    return [
      {
        enabled: typeof enabledValue === "boolean" ? enabledValue : true,
        id: CUSTOM_SOURCE_IDS[index] ?? "custom-1",
        label,
        template
      }
    ]
  })
}

export const toCustomSourceSlots = (value: unknown): CustomSourceSlot[] => {
  const normalizedSources = normalizeCustomSources(value)

  return CUSTOM_SOURCE_IDS.map((sourceId) => {
    const source = normalizedSources.find((entry) => entry.id === sourceId)
    if (!source) {
      return null
    }

    return {
      enabled: source.enabled,
      label: source.label,
      template: source.template
    }
  })
}

export const getSourceGlyph = (label: string) => {
  const words = label.match(/[A-Za-z0-9]+/g) ?? []

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return label.trim().slice(0, 2).toUpperCase() || "?"
}

export const renderSourceTemplate = (
  template: string,
  context: SearchTemplateContext
) => {
  const replacements: Record<string, string> = {
    "{{author}}": encodeURIComponent(context.author),
    "{{authorRaw}}": context.author,
    "{{query}}": encodeURIComponent(context.query),
    "{{queryRaw}}": context.query,
    "{{title}}": encodeURIComponent(context.title),
    "{{titleRaw}}": context.title
  }

  return Object.entries(replacements).reduce(
    (output, [token, value]) => output.split(token).join(value),
    template
  )
}

export const readCustomSourcesFromStorage = () =>
  new Promise<StoredCustomSource[]>((resolve) => {
    chrome.storage.sync.get([CUSTOM_SOURCES_KEY], (result) => {
      resolve(normalizeCustomSources(result[CUSTOM_SOURCES_KEY]))
    })
  })

export const writeCustomSourcesToStorage = (sources: CustomSourceSlot[]) =>
  new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [CUSTOM_SOURCES_KEY]: sources }, () => resolve())
  })

export const ensureDefaultCustomSourcesInStorage = () =>
  new Promise<StoredCustomSource[]>((resolve) => {
    chrome.storage.sync.get([CUSTOM_SOURCES_KEY], (result) => {
      const storedSources = normalizeCustomSources(result[CUSTOM_SOURCES_KEY])
      if (storedSources.length > 0) {
        resolve(storedSources)
        return
      }

      chrome.storage.sync.set({ [CUSTOM_SOURCES_KEY]: DEFAULT_CUSTOM_SOURCES }, () => {
        resolve(DEFAULT_CUSTOM_SOURCES)
      })
    })
  })
