# PosterHub – Static Portfolio Website

> **posterhub.in** · Poster Design & Advertising Studio · Kerala, India

A fully static, production-ready portfolio site built with plain HTML, CSS and vanilla JavaScript. No build step, no frameworks, no backend.

---

## 🚀 Quick Deploy

### Netlify (Recommended)
1. Drag-and-drop the entire `posterhub/` folder onto [netlify.com/drop](https://app.netlify.com/drop), or
2. Connect your GitHub repo → Netlify auto-deploys on every push.

### GitHub Pages
1. Push the folder to a GitHub repo.
2. Go to **Settings → Pages → Branch: main / root (/)** → Save.

### Cloudflare Pages
1. Connect your GitHub repo.
2. Build command: *(leave blank)*
3. Output directory: `/`

---

## 🖼️ How to Add a New Poster

1. **Drop the image** into the `images/` folder (JPG or WebP recommended, max ~500 KB).
2. **Open `script.js`** and add a new entry to the `works` array near the top:

```js
{
  id: 10,                              // unique number
  file: 'images/your-image.jpg',       // path relative to index.html
  title: 'Your Poster Title',
  category: 'Grand Opening',           // see existing categories below
  description: 'Short caption shown in the lightbox.',
  // featured: true,                   // uncomment to show "Latest" badge
},
```

**Available categories** (or add new ones — filters generate automatically):
- `Grand Opening`
- `Events`
- `Hiring`
- `Brand Teasers`
- `Offers`
- `Festival`

That's it. Refresh the browser and your poster appears in the gallery.

---

## 📞 How to Change Contact Details

All contact info lives in **two places**:

### 1. `index.html`

Search for `91XXXXXXXXXX` and replace with your actual number (no spaces, include country code):

```html
<!-- WhatsApp button -->
<a href="https://wa.me/919188283916?text=...">

<!-- Call button -->
<a href="tel:+919188283916">
```

Change the email:
```html
<a href="mailto:hello@posterhub.in">
```

### 2. `script.js`

Near the bottom of the file, find:
```js
const WA_NUMBER = '919188283916';
```
Replace with your number.

---

## 🎨 How to Change Brand Colors

Open `style.css` and edit the CSS variables at the top:

```css
:root {
  --clr-accent:  #ff4d2e;   /* primary orange-red */
  --clr-yellow:  #ffb800;   /* secondary yellow */
  --clr-bg:      #0d0d0f;   /* page background */
  /* ... */
}
```

---

## 📂 File Structure

```
posterhub/
├── index.html          ← All HTML markup
├── style.css           ← Design system + all styles
├── script.js           ← Gallery, lightbox, form, animations
├── images/
│   ├── infinity-grand-opening.jpg
│   ├── strangers-camp-1.jpg
│   ├── strangers-camp-2.jpg
│   ├── strangers-camp-3.jpg
│   ├── kbn-hiring.jpg
│   ├── cherans-launching-soon.jpg
│   ├── cherans-coming-soon.jpg
│   ├── kbn-led-offer.jpg
│   └── onam-greeting.jpg
└── README.md
```

---

## ✅ Lighthouse Targets

| Metric        | Target |
|---------------|--------|
| Performance   | 90+    |
| Accessibility | 95+    |
| Best Practices| 95+    |
| SEO           | 95+    |

**Tips to improve Performance:**
- Convert images to WebP (use [Squoosh](https://squoosh.app/)).
- Keep each image under 200 KB.
- Enable Gzip/Brotli on your host (Netlify does this automatically).

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 600 px | 1-column gallery, stacked hero |
| 600–899 px | 2-column gallery |
| 900–1099 px | 3-column gallery, side-by-side hero |
| ≥ 1100 px | 4-column gallery |

---

## 🛠️ Local Development

No build step needed — just open `index.html` in a browser, or use any static server:

```bash
# Python 3
python -m http.server 3000

# Node.js (npx)
npx serve .
```

---

## 📬 Contact Form

The form collects Name, Phone and Message, then opens WhatsApp with a pre-filled message. **No backend required** — it uses the `wa.me` deep-link API.

---

*Made with ❤️ by PosterHub · Kerala, India*
