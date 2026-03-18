const INSTALL_OPEN_URL =
  "https://goodlib.vercel.app"

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return

  chrome.tabs.create({ url: INSTALL_OPEN_URL })
})
