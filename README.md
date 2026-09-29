# TARGETS Agency — Website

The static landing page for **targetsagency.com**. There is no build step, no dependencies and no server code.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page, Arabic/RTL and responsive (desktop and mobile). CSS is inline. |
| `assets/icon.svg` | Logo mark, also used as the favicon. |
| `assets/arch.svg` | Hero illustration. |
| `assets/og.png` | 1200×630 social share preview image. |
| `CNAME` | The custom domain for GitHub Pages. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

Fonts load from Google Fonts: Alexandria for Arabic and Nunito Sans Black Italic for Latin text.

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
- Every contact button opens an Instagram DM at `https://ig.me/m/targetsagency1`. Replace them with WhatsApp once a business number exists.
- After the site is live, paste the URL into the Facebook Sharing Debugger to check that the share preview image shows up.
