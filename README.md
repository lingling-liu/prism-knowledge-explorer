# PRISM Data & Knowledge Explorer

Editable export of the existing Site's version 6, source revision `af519b9fed336646fb488076ffd8a654d69c457e`, exported September 16, 2026. This is recovered application source, not a recreation. The live Site was not modified.

## Upload and enable GitHub Pages

1. Extract the ZIP. Copy its contents into your existing repository folder (for example `C:\GitHub\prism-knowledge-explorer`). Put `index.html`, `package.json`, `data`, `thumbnails`, `scripts`, and `.github` at the repository root, not inside another folder. Include hidden `.github` and `.gitignore` files. Do not replace or remove your repository's `.git` folder.
2. In GitHub Desktop, review the changes, commit, then click Push origin. This export does not itself upload anything.
3. In the GitHub repository, open Settings → Pages. Set the build/deployment source to GitHub Actions.
4. Open Actions. The bundled Pages workflow runs on pushes to `main`, and can also be run manually. Wait for its successful deployment. Pages settings will show your public URL, typically `https://USERNAME.github.io/REPOSITORY-NAME/`.
5. If your default branch is not `main`, update the workflow's branch setting. GitHub Actions must be enabled and the workflow must be allowed to deploy to the `github-pages` environment.

Existing unrelated repository files are not removed by copying this export. Review any older application/workflow files before pushing to avoid conflicting deployments.

## Build and preview

Install Node.js 22 or later. There are no third-party npm dependencies or required backend services. `npm ci` validates the included dependency-free lockfile; then run:

```sh
npm run build
npm test
npm run serve
```

Preview at `http://127.0.0.1:4173`. Build output is `_site/`; GitHub Actions builds and deploys that directory. HTML, JS, CSS and thumbnails use relative paths, so repository-subpath hosting works without configuring a fixed repository name or base URL. Do not open the HTML as a `file://` URL to test online translation.

## Update resources and thumbnails

`data/resources.json` is the canonical editable resource dataset. All 498 records and every recovered field are retained, including two blank rows already present in the original. Preserve IDs and edit names, descriptions, locations, pollution types, themes, types, sources, links and metadata as needed. Save as UTF-8. `npm run build` regenerates `data.js` and copies the application into `_site`. Commit the edited JSON and generated `data.js`; push to redeploy. Filter options are generated from the dataset.

Place replacement images in `thumbnails/`. Set a resource's `thumbnail` to a relative path such as `thumbnails/my-report.jpg`, and give `thumbnailAlt` a descriptive value. The manually replaced UNEP screenshot is included as `thumbnails/unep-land-based-pollution.jpg`. Preserve image proportions and existing card styling. Rebuild, test, commit and push. All existing thumbnail assets, including local category fallback graphics, are bundled.

`scripts/recover-data.mjs` is an optional import utility: it extracts records from `data.js` into JSON. Do not run it after editing JSON unless you intentionally want to replace JSON with the JavaScript dataset.

## Translation

The original Google Translate webpage widget loads from `translate.google.com`. `translation.js` reads the widget's available language options automatically; no hardcoded 22-language restriction remains. There were 249 options including English when tested, but Google can change the list. English is the source language and the initial default; a device-local saved language preference is restored. Selecting English clears translation cookies and reloads the original text. Cookie clearing is adapted to the current hosting address rather than `chatgpt.site`.

Google's widget translates the interface. Newly displayed resource cards also use batched Google translation requests and a session cache. The requests use Google's public client endpoint at `translate.googleapis.com/translate_a/single?client=gtx`, not a paid API with a service guarantee. This endpoint is undocumented and may be rate-limited, changed, or blocked. If unavailable, affected resource text stays in its original language and a browser-console warning is logged. External requests send visible page/resource text to Google. Translation requires an internet connection and unblocked third-party scripts/cookies; it cannot be bundled for offline use. Language coverage in the widget does not guarantee every language works with the dynamic-card endpoint.

Arabic and other right-to-left text are Unicode text rendered by the browser and Google widget. Existing page geometry is preserved rather than redesigned/mirrored. Source URLs and filter values are never translated or rewritten. Search operates on the original English dataset and displayed translation does not add multilingual search indexing.

## Preserved features and limitations

Preserved: tags above thumbnails, clickable thumbnails and source-arrow buttons opening original links in new tabs, descriptions, metadata, full-text matching across name/description/source/location/pollution/theme/type, filters, sorting, pagination/load-more, About dialog, navigation, mobile filter drawer and UTF-8 corrections.

The recovered latest source does **not** have clickable resource titles or resource-detail views. Titles are headings; descriptions are shown on cards. The About dialog is the only dialog. These features cannot be claimed as exported or tested, and were not added as part of this export. Two original blank rows remain as placeholder cards with no usable source link. Any malformed source links are reported by validation and preserved, not guessed or replaced. External resource availability, sign-in requirements and broken third-party websites are beyond the export's control.

The two named resources with malformed original links are “Air Pollution and Health Impacts in Africa” (its stored link starts with `/https://`) and “Entire stretch of river Ganga in Bengal unfit for bathing: National Green Tribunal” (its link field contains prose instead of a URL). The original application's `#` link behavior is preserved for these records. Correct their `link` fields in the JSON if you have verified source URLs.

PRISM-owned code, data and thumbnails are local. Google Fonts is an existing external typography dependency with local system-font fallbacks. Google translation and third-party resource websites remain external services. There are no credentials, API keys, backend secrets, caches or node_modules included.
