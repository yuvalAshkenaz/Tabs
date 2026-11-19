# y-tabs 2.0.3

**y-tabs** is a tiny, accessible tabs library written in **vanilla JavaScript** and CSS. No dependencies, no setup code.  
When the tabs are wider than the screen, the list **scrolls sideways** with arrows, finger swipe and mouse drag.

> 🚀 **Live page and demo:** [y-tools.dooble.us/ytabs](https://y-tools.dooble.us/ytabs/)

---

## ✨ Key Features

- **Scrollable tabs** — a long list of tabs scrolls sideways instead of wrapping. An arrow at the end scrolls forward step by step and disappears at the end. Once you start scrolling, a back arrow appears and disappears at the start. You can also swipe with a finger or drag with the mouse. Works in RTL too.
- **No setup code** — add the classes and include the two files. The script finds every group on the page.
- **Several groups per page** — each `.tabs-group` works on its own.
- **Accessible** — sets `role`, `aria-selected`, `aria-controls` and `aria-labelledby` for you, uses a roving `tabindex`, and has a visible `:focus-visible` outline.
- **Keyboard support** — the left and right arrow keys move between tabs.
- **Reduced motion** — the arrows scroll without animation for `prefers-reduced-motion`.
- **Vanilla JS** — no jQuery, no frameworks.

---

## 📦 Installation

Download [`ytabs.min.css`](https://y-tools.dooble.us/wp-content/themes/ytools/tools/ytabs/dist/css/ytabs.min.css) and [`ytabs.min.js`](https://y-tools.dooble.us/wp-content/themes/ytools/tools/ytabs/dist/js/ytabs.min.js) (or the readable [`ytabs.css`](https://y-tools.dooble.us/wp-content/themes/ytools/tools/ytabs/dist/css/ytabs.css) and [`ytabs.js`](https://y-tools.dooble.us/wp-content/themes/ytools/tools/ytabs/dist/js/ytabs.js)) from the `dist` folder and include them in your HTML. **Both files are needed**: the CSS styles the tabs and the arrows, and the script adds the scrolling.

```html
<link rel="stylesheet" href="dist/css/ytabs.min.css" />
<script src="dist/js/ytabs.min.js"></script>
```

Put the `<script>` at the end of the `<body>`, after the tabs markup.

---

## 🚀 Usage

```html
<!-- Wrapper: one .tabs-group per set of tabs (you can have several on a page) -->
<div class="tabs-group">

	<!-- List of buttons: class tabs-list on the ul, class tabs-btn on every button -->
	<ul class="tabs-list" role="tablist">
		<li><button type="button" class="tabs-btn">First tab</button></li>
		<li><button type="button" class="tabs-btn">Second tab</button></li>
	</ul>

	<!-- Panels: class tabs-div, directly inside .tabs-group, after the list, in the same order as the buttons -->
	<div class="tabs-div">
		<h3>First panel</h3>
		<p>Content of the first tab.</p>
	</div>

	<div class="tabs-div">
		<h3>Second panel</h3>
		<p>Content of the second tab.</p>
	</div>

</div>
```

| Class | Where | Description |
|---|---|---|
| `tabs-group` | Wrapper `div` | One set of tabs and its panels. |
| `tabs-list` | `ul` | The list of tab buttons. |
| `tabs-btn` | `button` inside each `li` | A tab button. |
| `tabs-div` | `div` directly inside `.tabs-group` | A panel. The first button opens the first panel, the second button the second panel, and so on, so keep both in the same order. |

The first tab is open by default. The script adds `active` and all the `aria-*` attributes by itself, so you do not write them. It also wraps the `ul.tabs-list` in a `div.tabs-nav` that holds the two scroll arrows.

---

## 📱 Scrolling tabs

| Situation | What you get |
|---|---|
| The tabs fit | A normal row of tabs, no arrows. |
| The tabs are wider than the screen | The list scrolls sideways. An arrow appears at the end of the list and scrolls forward on every click until the end, then it disappears. |
| After scrolling | A back arrow appears at the start of the list and disappears when you are back at the start. |

You can also scroll with a finger swipe or by dragging the list with the mouse. The arrows are real buttons with an `aria-label`. You can restyle them with the `.tabs-arrow` selectors in `dist/css/ytabs.css`.

---

## 🎨 Customization

The colors come from CSS variables. Set them in your own CSS (on `:root` or on a wrapper) to match your site.

| Variable | Default | Description |
|---|---|---|
| `--ytabs-primary` | `#3560cf` | Text color of the open tab and the arrows. |
| `--ytabs-text` | `#141833` | Text color of the panels and the hovered tab. |
| `--ytabs-text-muted` | `#565c7d` | Text color of the closed tabs. |
| `--ytabs-border` | `#b9c0e6` | Border color of the tabs and the panels. |
| `--ytabs-bg` | `#fff` | Background of the panels and the open tab. |

The remaining colors (the blue accent `#517fe5`, the closed tab background) are written in `dist/css/ytabs.css`, so change them there or override the selectors.

---

## ⌨️ Keyboard

- `Tab` moves the focus to the open tab, and `Enter` or `Space` selects the focused tab.
- `←` and `→` move between the tabs and open the one you reach. The direction follows the page: in left-to-right pages `→` goes to the next tab and `←` to the previous one, and in right-to-left pages it is the other way around.
- The focused tab is scrolled into view.

---

## ♿ Accessibility and notes

- Use real `button` elements for the tabs, so they work with the keyboard without extra code.
- The script sets the ARIA roles for tabs.
- Moving to another tab moves the focus to the first link in its panel, or stays on the tab when the panel has no link.

---

## 🌐 Browser support

Modern browsers (Chrome, Edge, Firefox, Safari). It uses `ResizeObserver`, `scrollBy` and CSS logical properties.

---

## 📄 License

[MIT](LICENSE) © yuvalAshkenaz

---

## 🔗 Links

- Live page: [y-tools.dooble.us/ytabs](https://y-tools.dooble.us/ytabs/)
- More libraries by the same author: [y-tools.dooble.us](https://y-tools.dooble.us/)

Created by [Yuval Ashkenazi](https://y-tools.dooble.us/).
