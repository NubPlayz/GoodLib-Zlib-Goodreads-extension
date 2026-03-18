const INSTALL_OPEN_URL =
  "https://github.com/NubPlayz/GoodLib-Zlib-Goodreads-extension"

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return

  chrome.tabs.create({ url: INSTALL_OPEN_URL })
})
