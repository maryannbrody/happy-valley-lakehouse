# Happy Valley Lake House — Guest Book

A modern rustic digital guest book for the Happy Valley Lake House on Lake Wyola in Shutesbury, MA. Built as a static site — no build tools, no frameworks, no dependencies beyond a couple of CDN links.

The site serves as an interactive welcome guide for guests: house info, local recommendations, an interactive map, seasonal tips, and everything they need for a great stay.

## Project Structure

```
├── index.html              Main guest book site
├── styles.css              Full design system (modern rustic lakehouse)
├── script.js               Scroll animations, nav, season tabs, Leaflet map
├── print/
│   └── guestbook.html      Print-optimized version for PDF generation
├── CONTENT.md              All guest book text content, organized by section
└── README.md               This file
```

## Local Preview

No server required. Open `index.html` directly in your browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use any simple local server if you prefer:

```bash
# Python
python3 -m http.server 8000

# Node (npx, no install needed)
npx serve .
```

Then visit `http://localhost:8000`.

## Customizing Content

All guest book copy lives in `CONTENT.md`, organized by section (Welcome, Arrival, The Cabin, House Essentials, etc.). To make changes:

1. Edit `CONTENT.md` with your updated text.
2. Update the corresponding sections in `index.html` to match.

`CONTENT.md` is the single source of truth for copy — edit there first, then carry changes into the HTML.

## Swapping Placeholder Images

The site references images in a few places (hero background, room cards, etc.). To replace the placeholders:

1. Add your photos to the project (e.g., in an `images/` folder).
2. Update the `src` attributes in `index.html` to point to your new files.
3. For the hero, update the `<img>` inside `.hero__image`.
4. For room cards, update each `.room-card__image img`.

Recommended image sizes:
- **Hero:** 1920×1080 or larger (will be cropped via `object-fit: cover`)
- **Room cards:** 800×600 minimum (4:3 aspect ratio)

Use optimized formats (WebP or compressed JPEG) to keep load times fast.

## Generating the PDF Guest Book

The `print/guestbook.html` file is a print-optimized version of the guest book, designed to be saved as a PDF for printing or sharing.

1. Open `print/guestbook.html` in **Google Chrome**.
2. Press `Ctrl+P` (or `Cmd+P` on Mac).
3. Set **Destination** to "Save as PDF."
4. Under **More settings**, set margins to "Default" or "Minimum."
5. Enable "Background graphics" if you want accent colors.
6. Click **Save**.

The main `styles.css` also includes a `@media print` query, so printing `index.html` directly will produce a reasonable result as well — but `print/guestbook.html` is purpose-built for a cleaner PDF layout.

## Deployment

The site is fully static — just HTML, CSS, and JS. No build step required. Deploy it anywhere that serves static files.

### GitHub Pages

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, select the branch (e.g., `main`) and root folder (`/`).
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/`.

To use a custom domain, add a `CNAME` file with your domain name and configure DNS per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

### Netlify

1. Log in to [Netlify](https://www.netlify.com/) and click **Add new site → Import an existing project**.
2. Connect your GitHub repo.
3. Leave build settings empty (no build command, publish directory is `/` or `.`).
4. Click **Deploy site**.

Or drag-and-drop: just drag the project folder onto the Netlify dashboard.

### Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New → Project**.
2. Import your GitHub repo.
3. Framework preset: **Other**.
4. Leave build settings as default (no build command needed).
5. Click **Deploy**.

The site will be live at a `.vercel.app` URL, with automatic redeployments on every push.
