# <img width="128" height="128" alt="icon_128x128" src="https://github.com/user-attachments/assets/8e9dac2d-286b-4554-8a1a-423440989714" /> GoodLib

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=googlechrome)](https://chromewebstore.google.com/detail/goodlib-zlib-annas-archiv/aiampblkjnmfogckjfiecodcnenleehp?authuser=0&hl=en)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-orange?logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/goodlib-zlib-anna-s-archive/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)


**Open any Goodreads or Hardcover book on Anna's Archive, Z-Library, or Gutenberg in one click.**

GoodLib is a free, open source browser extension that injects source badges directly onto Goodreads and Hardcover book pages. No more copying titles and searching manually 

Learn more on [Offical site](https://goodlib.vercel.app)



## Features


<img width="1280" height="800" alt="Untitled design (5)" src="https://github.com/user-attachments/assets/7debd26f-9192-4c7f-8714-503f9ed4febf" />





- **One-click access** : badges appear directly on Goodreads and Hardcover book pages, linking straight to the searched result
- **No more copying titles and searching manually** 
- **Toggleable sources** : enable or disable individual sources from the popup (e.g. only show Z-Lib and Anna's, hide Gutenberg)
- **Animated UI** : powered by Anime.js v4
- **Zero data collection** : the extension only activates on supported book pages, collects nothing, and stores only your source toggle preferences locally
- **Cross-browser** : works on Chrome (MV3) and Firefox (MV3)



## Demo 


https://github.com/user-attachments/assets/04edaabf-a3df-471f-8cd1-5a308f5572c8

## Mobile view (firefox)

![mobile 1](https://github.com/user-attachments/assets/e40fa86f-0758-4164-9871-8cb46ef4fd9c)

--

![mobile promo 2](https://github.com/user-attachments/assets/488e36fb-a881-4e04-a447-2cf861a28367)

##  Mobile demo 

https://github.com/user-attachments/assets/7f2a5aa0-b6c8-4a2d-be4d-8d6b4daaefb1





## Install

| Browser | Link |
|---|---|
| Chrome | [Chrome Web Store](https://chromewebstore.google.com/detail/goodlib-zlib-annas-archiv/aiampblkjnmfogckjfiecodcnenleehp) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/goodlib-zlib-anna-s-archive/) |
| Firefox Mobile | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/goodlib-zlib-anna-s-archive/) |



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

GoodLib requests host permissions only for supported book pages:

- `https://www.goodreads.com/book/*`
- `https://hardcover.app/books/*`

- No user data is collected or transmitted
- Source toggle preferences are stored locally via the `storage` permission


Approved on both the Chrome Web Store and Firefox Add-ons.



## Contributing

Issues and PRs are welcome. If a source URL has changed or you want a new source added, open an issue.


## Disclaimer

Goodlib is a search tool (Extension ) that displays results from external metadata providers and sources.
It does not host, store, or distribute any content.
The developers are not responsible for how the tool is used or what is accessed through it.

Users are solely responsible for:

- Ensuring they have the legal right to download any material they access
- Complying with copyright laws and intellectual property rights in their jurisdiction
- Understanding and accepting the terms of any sources they configure
- Use of this tool is entirely at your own risk.
 
Not affiliated with Goodreads, Hardcover, Z-Library, Anna's Archive, or Project Gutenberg.
 

## License

MIT
