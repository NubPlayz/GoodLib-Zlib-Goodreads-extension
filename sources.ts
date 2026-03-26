export const ZLIB_ENABLED_KEY = "zlibEnabled"
export const ANNA_ENABLED_KEY = "annaEnabled"
export const GUTENBERG_ENABLED_KEY = "gutenbergEnabled"

export const ZLIB_DOMAIN_KEY = "zlibDomain"
export const DEFAULT_ZLIB_DOMAIN = "z-library.gs"
export const ANNA_DOMAIN_KEY = "annaDomain"
export const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
export const CUSTOM_SOURCES_KEY = "customSources"
export const MAX_CUSTOM_SOURCES = 2

export type SourceKey = "zlib" | "anna" | "gutenberg"
export type SearchTemplateContext = {
  author: string
  query: string
  title: string
}

export type StoredCustomSource = {
  enabled: boolean
  id: string
  label: string
  template: string
}

export const SAMPLE_CUSTOM_SOURCES: StoredCustomSource[] = [
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
        id: `custom-${index + 1}`,
        label,
        template
      }
    ]
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
