# Calculator

A multi-theme calculator widget built with plain HTML, CSS, and vanilla JavaScript — no frameworks or dependencies.

| macOS | Windows 7 |
|---|---|
| ![macOS Calculator](images/screenshots/osx.png) | ![Windows 7 Calculator](images/screenshots/windows7.png) |

## Features

- Full arithmetic: addition, subtraction, multiplication, division
- Operator chaining (e.g. `5 + 3 *` evaluates `8` before continuing)
- Sign toggle (`±`), decimal input, and division-by-zero handling
- Memory functions: `MC`, `M+`, `M-`, `MR`, `MS`
- Additional operations (Windows 7 theme): backspace (`←`), clear entry (`CE`), square root (`√`), percent (`%`), reciprocal (`1/x`)
- Floating-point noise suppression (e.g. `0.1 + 0.2` displays `0.3`)
- Draggable — grab the title bar to drag the calculator anywhere on the page
- Theme switcher — dropdown in the top-left corner to switch themes; selection is persisted via cookie

## Themes

Themes are implemented using the HTML `<template>` tag. Each theme is a self-contained template in `index.html` that gets instantiated at load time based on the active theme cookie. Switching themes sets the `calc-theme` cookie and reloads the page.

- **macOS** (`css/osx.css`) — macOS-inspired styling with gradients, rounded corners, and box-shadows
- **Windows 7** (`css/windows7.css`) — Windows 7 Aero glass styling with the characteristic title bar, grey body, blue-grey display gradient, and italic display font

## How it's built

- **`index.html`** — one `<template>` per theme; a small inline script reads the `calc-theme` cookie and instantiates the matching template
- **`css/base.css`** — base page styles and theme-switcher dropdown
- **`css/osx.css`** — macOS theme
- **`css/windows7.css`** — Windows 7 Aero theme
- **`js/calc.js`** — all calculator logic and drag behaviour in a single vanilla JS IIFE; no libraries required

## Running locally

No build step needed. Open `index.html` directly in any modern browser:

```
open index.html
```

## Project

https://github.com/paragshah/Calculator
