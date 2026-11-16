const INSTALL_OPEN_URL = "https://goodlib.vercel.app"
const UNINSTALL_SURVEY_URL = "https://forms.gle/2Khb8czfxLUgE1F78"

try {
  chrome.runtime.setUninstallURL(UNINSTALL_SURVEY_URL)
} catch {
}

chrome.runtime.onInstalled.addListener((details) => {
  try {
    chrome.runtime.setUninstallURL(UNINSTALL_SURVEY_URL)
  } catch {
  }

  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return

  chrome.tabs.create({ url: INSTALL_OPEN_URL })
})
