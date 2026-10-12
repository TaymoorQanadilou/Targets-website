# TARGETS Agency — Website

The static landing page for **targetsagency.com**. There is no build step, no dependencies and no server code.

## Files

| File | What it is |
|---|---|
| `index.html`, `en/index.html` | Arabic/RTL and English/LTR homepages. |
| `ads/`, `web/`, `en/ads/`, `en/web/` | Localized service pages. |
| `privacy/index.html` | Bilingual privacy policy. |
| `assets/*.css` | Shared site/accessibility styles and home, services, and privacy styles. |
| `assets/icon.svg` | Logo mark, also used as the favicon. |
| `assets/arch.svg` | Hero illustration. |
| `assets/og.png` | 1200×630 social share preview image. |
| `sitemap.xml`, `robots.txt` | Seven canonical page URLs and crawler discovery. |
| `scripts/audit.py` | Optional Python standard-library checks; not needed for deployment. |
| `CNAME` | The custom domain for GitHub Pages. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

Fonts load from Google Fonts: Alexandria and Nunito Sans, with the existing weights and `display=swap`. The font stylesheet loads without blocking rendering and has a `<noscript>` fallback. Privacy also uses regular Nunito Sans for its English section.

Page artwork stays in lightweight SVG (no raster conversion required). The social preview stays in PNG for sharing compatibility and is losslessly compressed. Only footer logos are lazy-loaded; homepage hero artwork loads eagerly with high priority.

## Deploy option A: GitHub Pages

1. Open the repo's **Settings → Pages**. Set **Source** to `Deploy from a branch`, then choose `main` and `/ (root)`.
2. In **Custom domain**, enter `targetsagency.com`. The `CNAME` file already contains it.
3. Add these records at the domain registrar:
   - Four `A` records for `@`, pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - One `CNAME` record for `www`, pointing to `<github-username>.github.io`.
4. Once the DNS change is live, tick **Enforce HTTPS**.

## Deploy option B: Netlify or Cloudflare Pages

Connect the repo and leave the build command empty. Set the publish directory to `/`, then add `targetsagency.com` as the custom domain and follow the DNS steps the platform shows.

## Before and after launch

- The footer LinkedIn link is missing on purpose. Add it once the company page URL is ready.
- Every contact button opens WhatsApp Business at `https://wa.me/962787562587` with a prefilled message per page (home / ads / web, Arabic or English) so incoming chats show which page they came from. The footer keeps the Instagram, TikTok and Facebook profile links.
- After the site is live, paste the URL into the Facebook Sharing Debugger to check that the share preview image shows up.

## Audit checks

Run `python3 scripts/audit.py` from the repository root. No package installation or build is required. It validates page-specific metadata, canonical URLs, JSON-LD, sitemap coverage, local files and anchor targets, heading order, image attributes, and language/direction attributes.

For a browser check, serve the repository with `python3 -m http.server 8000` and visit all seven pages. Check 320, 375, 768, 860, 900, 1024, and 1440 CSS-pixel widths, keyboard skip links and FAQ controls, reduced motion, and JavaScript disabled. Font stylesheets should eventually have `media="all"` when JavaScript is enabled. Verify external contact redirects separately; Instagram DM requires an authenticated Instagram account. Email links open the visitor's mail app; a link audit does not verify mail delivery.

When adding a page, give it a unique title/description and canonical URL, update `sitemap.xml`, and update the expected page count in `scripts/audit.py`. Keep Arabic/English alternate links reciprocal. Use the shared Organization identity, including its WhatsApp `contactPoint` (+962787562587); do not add a physical address or LocalBusiness claims until verified.

Cloudflare Pages deployment remains unchanged: no build command, repository root as the publish directory, no Functions/Worker, no dependencies, and no tracking scripts added by this repository.
