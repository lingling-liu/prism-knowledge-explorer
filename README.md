# PRISM Data & Knowledge Explorer

This repository contains the complete static PRISM Explorer. It preserves the current card layout, clickable thumbnails, search, filters, responsive mobile layout, UTF-8 text corrections, resource data, and locally stored thumbnail assets.

The site is fully static. It does not require a database, server-side application, API key, or the original `chatgpt.site` deployment. Google Fonts are the only external presentation dependency; the site falls back to sans-serif fonts if they are unavailable.

## Publish on GitHub Pages

1. Extract `prism-explorer-github.zip`.
2. Create an empty GitHub repository. Do not initialize it with another README.
3. Upload all extracted files and folders, including the hidden `.github` folder, to the repository's `main` branch. You can use GitHub's **Add file → Upload files** interface or Git locally.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **GitHub Actions** as the source.
6. Open the **Actions** tab and wait for **Deploy PRISM Explorer to GitHub Pages** to finish.
7. The deployed address will normally be `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All site asset references are relative, so the explorer works under a GitHub repository subpath without editing a base URL.

## Test locally

Install Node.js 22 or newer, then run:

```bash
npm test
npm run build
npm run serve
```

Open <http://127.0.0.1:4173>. No `npm install` is required because the project has no third-party build dependencies.

## Update resources

Edit `data/resources.json`. Each entry contains:

- `name`, `description`, `source`, and `link`
- `location`, `pollution`, `theme`, and `type`
- `thumbnail` and `thumbnailAlt`

Keep external resource links as complete `https://` URLs. Keep thumbnail paths relative, for example:

```json
"thumbnail": "thumbnails/my-resource.jpg"
```

After editing, run `npm test` and `npm run build`. Commit and push the changes to `main`; the GitHub Pages workflow will redeploy automatically.

## Replace or add a thumbnail

1. Save the image in `thumbnails/` using a stable, descriptive filename.
2. Update that resource's `thumbnail` value in `data/resources.json`.
3. Add useful alternative text in `thumbnailAlt`.
4. Preserve the image's important content. Cards use `object-fit: contain`, so images are not stretched or cropped.
5. Run the validation and build commands above before pushing.

## Project structure

```text
.
├── .github/workflows/deploy-pages.yml  # GitHub Pages deployment
├── data/resources.json                 # Editable resource catalogue
├── thumbnails/                         # All local thumbnail assets
├── scripts/                            # Build, validation, and preview tools
├── index.html                          # Explorer page
├── app.js                              # Search, filters, cards, and interactions
├── styles.css                          # Main responsive styling
├── card-overrides.css                  # Card ordering and thumbnail styles
└── data.js                             # Generated browser-ready resource data
```

## Notes

- Two source records contain invalid links in the original dataset and are preserved unchanged: **Air Pollution and Health Impacts in Africa** has a leading slash before its URL, and **Entire stretch of river Ganga in Bengal unfit for bathing: National Green Tribunal** contains description text instead of a URL. Their card links remain inactive until `link` is corrected in `data/resources.json`.
- Two blank rows present in the source dataset are also preserved for fidelity.
- Resource links open third-party websites in new tabs. Availability of those external websites is outside this project's control.
- Do not commit `node_modules/` or `_site/`; both are excluded by `.gitignore`.
