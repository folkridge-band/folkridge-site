<!-- Heading -->
# Folk Ridge Homepage Prototype

<!-- Description -->
This is a prototype homepage for the band **Folk Ridge**.

## Updated build tools (November 2026)

Your existing `source/` folders, Liquid templates, CSS classes, plain JavaScript,
and generated asset paths are preserved. Laravel Mix is now version 6 with
Webpack 5, PostCSS 8, and Dart Sass. Two media queries needed a space after `and`
for modern Sass. Unused direct dependencies were removed. Swiper's existing CDN
links now use the same explicit version as `package.json`.

### Local requirements and commands

Tested with **Node 24.22.2 / npm 11**, **Ruby 3.4.12**, and **Bundler 4.0.16**.
These runtime requirements apply to this Jekyll project; keep Strapi on Node 22.
The version files configure the project; they do not change your installed runtimes.
Select/install those versions before refreshing your local dependencies. On Windows,
use RubyInstaller with Devkit for Ruby 3.4. If you already use nvm-windows, select
Node with `nvm install 24.22.2` followed by `nvm use 24.22.2`.

From this project folder, after selecting the runtimes:

```powershell
node --version
ruby --version
gem install bundler -v 4.0.16
npm ci
bundle install
npm run dev
```

The familiar commands remain:

- `npm run dev`: compile assets once for development.
- `npm run watch`: compile and watch source files until you stop it.
- `npm run prod`: compile production assets.
- `bundle exec jekyll serve`: start Jekyll manually, after Strapi is ready.

The upgrade was tested with isolated dependencies. Your original `node_modules`
and globally installed Ruby gems were not replaced; run the installation commands
above before using the new scripts in your normal terminal. Keep both lockfiles
in Git so future installs use the tested dependency versions.

### Netlify build

`netlify.toml` now runs `npm run prod && bundle exec jekyll build` and publishes
`_site`. It requests Ruby 3.4.12, production Jekyll mode, and the hosted Strapi v5
API. `.nvmrc` selects Node 24.22.2. `NPM_FLAGS = "--include=dev"` ensures the asset
compiler is installed even when a production Node environment is configured.
The Ruby lockfile includes Windows and Linux platforms.

These settings follow [Netlify's dependency configuration documentation](https://docs.netlify.com/build/configure-builds/manage-dependencies/).
No Netlify account settings or pricing-plan changes were made. Before updating
the production branch, use a branch deploy/Deploy Preview if available and inspect
its build log and pages. The actual Netlify Linux build has not been run here.

### Compatibility pins and remaining maintenance

Webpack is pinned to 5.105.4 because newer versions removed an internal helper
required by Mix 6. `schema-utils` 4.x is pinned to 4.7.0 to keep its Webpack peer
requirements compatible; versions 2 and 3 used elsewhere are unaffected. Do not
update these pins independently of Mix. The command changes follow the official
[Mix 6 upgrade guide](https://laravel-mix.com/docs/6.0/upgrade).

A dependency advisory check on November 3, 2026 still flagged five packages in
Mix's tooling dependency tree: `elliptic`, `minimatch`, `uuid`,
`webpack-dev-middleware`, and `webpack-dev-server`. Available fixes require
incompatible changes or an upstream replacement. They have not been forced into
Mix. Netlify publishes the generated static site, not the development server;
avoid exposing `npm run hot` publicly. A future build-tool migration can remove
this legacy tooling without changing the website design.

Sass also warns about legacy `@import` rules. They still compile and were kept to
preserve your current stylesheet structure. Jekyll's Strapi gem warns about
`ostruct` becoming optional in Ruby 4; this project uses Ruby 3.4.

### Verification performed

- Clean `npm ci`, development compilation, and production compilation passed.
- Isolated Ruby 3.4 installation, frozen Bundler dependency check, and production
  Jekyll build passed using the hosted Strapi v5 content API.
- Six pages were checked at desktop (1366 px) and mobile (390 px) widths: home,
  history, band members, reserves, rates, and contact. All twelve page checks
  passed without JavaScript page errors or measured style/layout differences
  between the old and new compiled assets.
- Mobile navigation, Swiper navigation, member/reserve biography popups, and the
  presence of Netlify form markup were checked. No form was submitted.
- Validation used one-off builds without starting a server or watcher.

## Strapi v5 API

The website now uses the v5 adapter in `_plugins/strapi_v5.rb`. Existing layouts,
CSS and JavaScript are preserved; the adapter keeps nested image/component paths
familiar. Start both local servers manually, with Strapi ready before Jekyll.

The local API is `http://127.0.0.1:1339/api`, configured in `_config.yml`.
Netlify gets **STRAPI_API_URL** from `netlify.toml`, which points to the hosted API:
`https://strapi-folkridge-v5-64018045401c.herokuapp.com/api`.
The existing adapter uses that setting during the build. The normal local command
still uses `_config.yml`; there is no need to switch URLs by hand or add the
public API URL separately in Netlify's dashboard.

After these frontend changes are pushed, add the existing Netlify build-hook URL
in the hosted Strapi admin under **Settings > Webhooks**. Select the Entry Create,
Update and Delete events to rebuild when website content changes. The build-hook
URL stays in Strapi's settings; it is not stored in this public website repository.

To try a different API temporarily in PowerShell, without editing the config:

```powershell
$env:STRAPI_API_URL = 'http://127.0.0.1:1339/api'
```

Then use the normal `bundle exec jekyll serve` or `bundle exec jekyll build`.
`Remove-Item Env:STRAPI_API_URL` restores the local `_config.yml` default in that
terminal. No read token is needed for the website's public content APIs.

## Faster local development

Start the site as usual, and leave the server running while you edit:

```powershell
bundle exec jekyll serve
```

The first run downloads each Strapi collection when it is needed and saves it in
`.jekyll-cache/`. Later template reads, automatic rebuilds, and server restarts
reuse that content. Jekyll still rebuilds your HTML so local changes appear;
it skips downloading the same content again.

After changing content in Strapi, stop the server with `Ctrl+C`, then run:

```powershell
bundle exec jekyll clean
bundle exec jekyll serve
```

`clean` removes generated output and the cache. The next run fetches the latest
Strapi content and recreates the output. Restart the server after editing
`_config.yml`; Jekyll clears its cache when the loaded configuration changes.
The cache folder is already ignored by Git.

### How the code works

The small plugin in `_plugins/strapi_cache.rb` wraps the Strapi plugin's `each`
method, which templates use to read collections:

- `@site.config["serving"]` requires `jekyll serve`, and
  `Jekyll.env == "development"` requires development mode. Both must be true.
- `key` identifies the endpoint, collection, and its settings.
- `cache.getset(key)` returns saved documents if they exist. Otherwise, it runs
  the block once and saves the result to memory and disk.
- `super()` calls the Strapi v5 adapter to download and prepare documents.
- `documents.each(&block)` passes those documents back to the template as usual.

`jekyll build` bypasses this cache and fetches fresh content, even when
`JEKYLL_ENV` is unset. Serving in production mode also bypasses it. No changes to
the deployment command or environment are needed for this caching feature.





