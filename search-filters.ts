export interface AnnaPreferences {
  sort?: string
  formats?: string[]
  languages?: string[]
}

export interface ZlibPreferences {
  order?: string
  formats?: string[]
  languages?: string[]
}

export interface FilterOption {
  value: string
  label: string
}

export const DEFAULT_ZLIB_DOMAIN = "z-lib.sk"
export const DEFAULT_ANNA_DOMAIN = "annas-archive.gd"
export const DEFAULT_AUDIOBOOKBAY_DOMAIN = "https://audiobookbay.lu"

export const ZLIB_DOMAIN_KEY = "zlibDomain"
export const ANNA_DOMAIN_KEY = "annaDomain"
export const AUDIOBOOKBAY_DOMAIN_KEY = "audiobookbayDomain"
export const ANNA_FILTERS_KEY = "annaFilters"
export const ZLIB_FILTERS_KEY = "zlibFilters"

export const ANNA_SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Most Relevant" },
  { value: "newest", label: "Newest (Publication Year)" },
  { value: "oldest", label: "Oldest (Publication Year)" },
  { value: "largest", label: "Largest (Filesize)" },
  { value: "smallest", label: "Smallest (Filesize)" },
  { value: "newest_added", label: "Newest (Open Sourced)" },
  { value: "oldest_added", label: "Oldest (Open Sourced)" },
  { value: "random", label: "Random" }
]

export const ANNA_FORMATS: string[] = [
  "pdf",
  "epub",
  "zip",
  "mobi",
  "fb2",
  "cbr",
  "cbz",
  "txt",
  "djvu",
  "azw3",
  "doc",
  "lit",
  "rtf",
  "rar",
  "htm",
  "html",
  "docx",
  "mht",
  "lrf",
  "jpg",
  "uvz",
  "chm",
  "azw",
  "pdb",
  "odt",
  "ppt",
  "kfx",
  "prc",
  "xls",
  "xlsx",
  "json",
  "tar",
  "tif",
  "snb",
  "updb",
  "htmlz",
  "7z",
  "cb7",
  "gz",
  "pptx",
  "png",
  "exe",
  "ai"
]

const ANNA_LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Chinese",
  es: "Spanish",
  ru: "Russian",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ar: "Arabic",
  ja: "Japanese",
  nl: "Dutch",
  bg: "Bulgarian",
  pl: "Polish",
  et: "Estonian",
  la: "Latin",
  tr: "Turkish",
  hu: "Hungarian",
  he: "Hebrew",
  "zh-Hant": "Traditional Chinese",
  cs: "Czech",
  sv: "Swedish",
  da: "Danish",
  ko: "Korean",
  id: "Indonesian",
  uk: "Ukrainian",
  ro: "Romanian",
  el: "Greek",
  lt: "Lithuanian",
  ca: "Catalan",
  bn: "Bengali",
  no: "Norwegian",
  af: "Afrikaans",
  fi: "Finnish",
  hr: "Croatian",
  sr: "Serbian",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
  ga: "Irish",
  lv: "Latvian",
  fa: "Persian",
  sk: "Slovak",
  kn: "Kannada",
  bo: "Tibetan",
  ur: "Urdu",
  cy: "Welsh",
  jv: "Javanese",
  be: "Belarusian",
  yi: "Yiddish",
  hy: "Armenian",
  sl: "Slovenian",
  rw: "Kinyarwanda",
  ta: "Tamil",
  kk: "Kazakh",
  ml: "Malayalam",
  shn: "Shan",
  eo: "Esperanto",
  mn: "Mongolian",
  ka: "Georgian",
  mr: "Marathi",
  gu: "Gujarati",
  gl: "Galician",
  fil: "Filipino",
  te: "Telugu",
  ky: "Kyrgyz",
  arz: "Egyptian Arabic",
  ms: "Malay",
  az: "Azerbaijani",
  sw: "Swahili",
  qu: "Quechua",
  pa: "Punjabi",
  ba: "Bashkir",
  sq: "Albanian",
  uz: "Uzbek",
  eu: "Basque",
  av: "Avaric",
  bs: "Bosnian",
  my: "Burmese",
  am: "Amharic",
  ku: "Kurdish",
  fy: "Western Frisian",
  zu: "Zulu",
  ps: "Pashto",
  ne: "Nepali",
  ug: "Uyghur",
  so: "Somali",
  om: "Oromo",
  ht: "Haitian Creole",
  mk: "Macedonian",
  lo: "Lao",
  tt: "Tatar",
  si: "Sinhala",
  sn: "Shona",
  su: "Sundanese",
  tg: "Tajik",
  nb: "Norwegian Bokmål",
  ckb: "Central Kurdish",
  mg: "Malagasy",
  xh: "Xhosa",
  ha: "Hausa"
}

export const ANNA_LANGUAGES: string[] = [
  "en",
  "zh",
  "es",
  "ru",
  "fr",
  "de",
  "it",
  "pt",
  "ar",
  "ja",
  "nl",
  "bg",
  "pl",
  "et",
  "la",
  "tr",
  "hu",
  "he",
  "zh-Hant",
  "cs",
  "sv",
  "da",
  "ko",
  "id",
  "uk",
  "ro",
  "el",
  "lt",
  "ca",
  "bn",
  "no",
  "af",
  "fi",
  "hr",
  "sr",
  "hi",
  "th",
  "vi",
  "ga",
  "lv",
  "fa",
  "sk",
  "kn",
  "bo",
  "ur",
  "cy",
  "jv",
  "be",
  "yi",
  "hy",
  "sl",
  "rw",
  "ta",
  "kk",
  "ml",
  "shn",
  "eo",
  "mn",
  "ka",
  "mr",
  "gu",
  "gl",
  "fil",
  "te",
  "ky",
  "arz",
  "ms",
  "az",
  "sw",
  "qu",
  "pa",
  "ba",
  "sq",
  "uz",
  "eu",
  "av",
  "bs",
  "my",
  "am",
  "ku",
  "fy",
  "zu",
  "ps",
  "ne",
  "ug",
  "so",
  "om",
  "ht",
  "mk",
  "lo",
  "tt",
  "si",
  "sn",
  "su",
  "tg",
  "nb",
  "ckb",
  "mg",
  "xh",
  "ha"
]

export const ANNA_LANGUAGE_OPTIONS: FilterOption[] = ANNA_LANGUAGES.map((code) => ({
  value: code,
  label: `${ANNA_LANGUAGE_NAMES[code] || code} (${code})`
}))

export const ZLIB_SORT_OPTIONS: FilterOption[] = [
  { value: "bestmatch", label: "Best Match" },
  { value: "popular", label: "Most Popular" },
  { value: "date", label: "Recently Added" },
  { value: "titleA", label: "By Title (A–Z)" },
  { value: "title", label: "By Title (Z–A)" },
  { value: "year", label: "By Year" },
  { value: "filesize", label: "File Size ↓" },
  { value: "filesizeA", label: "File Size ↑" }
]

export const ZLIB_FORMATS: string[] = [
  "AZW",
  "EPUB",
  "MOBI",
  "PDF",
  "AZW3",
  "CBZ",
  "DJV",
  "DJVU",
  "FB2",
  "LIT",
  "RTF",
  "TXT"
]

export const ZLIB_LANGUAGES: string[] = [
  "armenian",
  "bengali",
  "arabic",
  "azerbaijani",
  "chinese",
  "dutch",
  "german-russian",
  "yiddish",
  "uzbek",
  "turkmen",
  "tigrinya",
  "tibetan",
  "tatar",
  "tamil",
  "tajik",
  "tagalog",
  "swedish",
  "sundanese",
  "southern_sotho",
  "south_ndebele",
  "somali",
  "slovenian",
  "slovak",
  "sinhala",
  "sindhi",
  "sichuan_yi",
  "shona",
  "sardinian",
  "sanskrit",
  "sango",
  "samoan",
  "romansh",
  "romanian",
  "rundi",
  "quechua",
  "persian",
  "punjabi",
  "pali",
  "ossetian",
  "oromo",
  "odia",
  "ojibwa",
  "occitan",
  "occidental",
  "norwegian_nynorsk",
  "norwegian_bokmal",
  "norwegian",
  "northern_sami",
  "north_ndebele",
  "nepali",
  "ndonga",
  "navajo",
  "nauru",
  "mongolian",
  "moldavian",
  "moksha",
  "marshallese",
  "marathi",
  "maori",
  "manx",
  "english",
  "french",
  "georgian",
  "german",
  "greek",
  "hindi",
  "indonesian",
  "italian",
  "japanese",
  "korean",
  "malaysian",
  "pashto",
  "polish",
  "portuguese",
  "russian",
  "serbian",
  "spanish",
  "telugu",
  "thai",
  "traditional chinese",
  "turkish",
  "ukrainian",
  "urdu",
  "vietnamese",
  "abkhazian",
  "afar",
  "afrikaans",
  "akan",
  "albanian",
  "amharic",
  "aragonese",
  "assamese",
  "avaric",
  "avestan",
  "aymara",
  "bambara",
  "basque",
  "bashkir",
  "belarusian",
  "berber",
  "bislama",
  "bosnian",
  "brazilian",
  "breton",
  "bulgarian",
  "burmese",
  "central_khmer",
  "catalan",
  "chamorro",
  "chechen",
  "chichewa",
  "church_slavic",
  "chuvash",
  "cornish",
  "corsican",
  "crimean",
  "cree",
  "croatian",
  "czech",
  "danish",
  "divehi",
  "dzongkha",
  "erzya",
  "esperanto",
  "estonian",
  "ewe",
  "faroese",
  "finnish",
  "fijian",
  "fulah",
  "gaelic",
  "galician",
  "ganda",
  "gujarati",
  "guarani",
  "haitian",
  "hausa",
  "hebrew",
  "herero",
  "hungarian",
  "hiri_motu",
  "icelandic",
  "ido",
  "igbo",
  "indigenous",
  "interlingua",
  "maltese",
  "malayalam",
  "malagasy",
  "macedonian",
  "luxembourgish",
  "luba-katanga",
  "lithuanian",
  "lingala",
  "limburgan",
  "latvian",
  "latin",
  "lao",
  "kurdish",
  "kuanyama",
  "kongo",
  "komi",
  "kyrgyz",
  "kinyarwanda",
  "kikuyu",
  "kazakh",
  "kashmiri",
  "karakalpak",
  "kannada",
  "kanuri",
  "kalaallisut",
  "javanese",
  "irish",
  "inupiaq",
  "inuktitut"
]

export const formatTitleCase = (str: string): string => {
  return str
    .split(/([ -_])/)
    .map((part) => {
      if (part === " " || part === "-" || part === "_") {
        return part === "_" ? " " : part
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join("")
}

export const ZLIB_LANGUAGE_OPTIONS: FilterOption[] = ZLIB_LANGUAGES.map((lang) => ({
  value: lang,
  label: formatTitleCase(lang)
}))

const normalizeDomain = (domain: string, fallback: string): string => {
  const clean = (domain || "").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "")
  return clean || fallback
}

export function buildAnnaSearchUrl(
  query: string,
  preferences?: AnnaPreferences,
  domain: string = DEFAULT_ANNA_DOMAIN
): string {
  const cleanDomain = normalizeDomain(domain, DEFAULT_ANNA_DOMAIN)
  const encodedQuery = encodeURIComponent(query)

  const hasSort = typeof preferences?.sort === "string"
  const hasFormats = Array.isArray(preferences?.formats) && preferences.formats.length > 0
  const hasLanguages = Array.isArray(preferences?.languages) && preferences.languages.length > 0

  if (!hasSort && !hasFormats && !hasLanguages) {
    return `https://${cleanDomain}/search?q=${encodedQuery}`
  }

  const queryParts: string[] = []

  if (hasSort) {
    queryParts.push(`sort=${encodeURIComponent(preferences!.sort!)}`)
  }

  if (hasFormats) {
    preferences!.formats!.forEach((ext) => {
      queryParts.push(`ext=${encodeURIComponent(ext)}`)
    })
  }

  if (hasLanguages) {
    preferences!.languages!.forEach((lang) => {
      queryParts.push(`lang=${encodeURIComponent(lang)}`)
    })
  }

  queryParts.push(`q=${encodedQuery}`)

  return `https://${cleanDomain}/search?${queryParts.join("&")}`
}

export function buildZlibSearchUrl(
  query: string,
  preferences?: ZlibPreferences,
  domain: string = DEFAULT_ZLIB_DOMAIN
): string {
  const cleanDomain = normalizeDomain(domain, DEFAULT_ZLIB_DOMAIN)
  const encodedQuery = encodeURIComponent(query)

  const hasOrder = Boolean(preferences?.order)
  const hasFormats = Array.isArray(preferences?.formats) && preferences.formats.length > 0
  const hasLanguages = Array.isArray(preferences?.languages) && preferences.languages.length > 0

  if (!hasOrder && !hasFormats && !hasLanguages) {
    return `https://${cleanDomain}/s/${encodedQuery}`
  }

  const params = new URLSearchParams()

  if (hasLanguages) {
    preferences!.languages!.forEach((lang, index) => {
      params.append(`languages[${index}]`, lang)
    })
  }

  if (hasFormats) {
    preferences!.formats!.forEach((ext, index) => {
      params.append(`extensions[${index}]`, ext)
    })
  }

  if (hasOrder) {
    params.append("order", preferences!.order!)
  }

  return `https://${cleanDomain}/s/${encodedQuery}/?${params.toString()}`
}

