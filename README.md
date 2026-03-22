# GoodLib

**Open any Goodreads book on Anna's Archive, Z-Library, or Gutenberg in one click.**

GoodLib is a free, open source browser extension that injects source badges directly onto Goodreads book pages. No more copying titles and searching manually 


[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=googlechrome)](YOUR_CWS_LINK)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-orange?logo=firefox)](YOUR_AMO_LINK)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)


## Features


<img width="1280" height="800" alt="Untitled design (5)" src="https://github.com/user-attachments/assets/7debd26f-9192-4c7f-8714-503f9ed4febf" />





- **One-click access** : badges appear directly on Goodreads book pages, linking straight to the searched result
- **No more copying titles and searching manually** 
- **Toggleable sources** : enable or disable individual sources from the popup (e.g. only show Z-Lib and Anna's, hide Gutenberg)
- **Animated UI** : powered by Anime.js v4
- **Zero data collection** : the extension only activates on `goodreads.com/book/*`, collects nothing, and stores only your source toggle preferences locally
- **Cross-browser** : works on Chrome (MV3) and Firefox (MV3)


## Demo 


https://github.com/user-attachments/assets/04edaabf-a3df-471f-8cd1-5a308f5572c8




## Supported Sources


 - Anna's Archive
 - Z-Library
 - Project Gutenberg 
> More sources planned based on feedback.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Plasmo](https://docs.plasmo.com/) 0.90.5 |
| Language | TypeScript 5.3.3 |
| UI | React (popup) |
| Animations | Anime.js |
| Package Manager | pnpm |
| Manifest | MV3 (Chrome + Firefox) |



## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Development

```bash
git clone https://github.com/NubPlayz/GoodLib-Zlib-Goodreads-extension
cd GoodLib-Zlib-Goodreads-extension
pnpm install

```

### Dev 

Run this command :
```
pnpm dev
```

Then load `build/chrome-mv3-dev` as an unpacked extension in Chrome, or the equivalent Firefox build directory.


## Privacy

GoodLib requests only one host permission: `https://www.goodreads.com/book/*`.

- No user data is collected or transmitted
- Source toggle preferences are stored locally via the `storage` permission


Approved on both the Chrome Web Store and Firefox Add-ons.



## Contributing

Issues and PRs are welcome. If a source URL has changed or you want a new source added, open an issue.



## License

MIT
