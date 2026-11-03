<!-- Heading -->
# Folk Ridge Homepage Prototype

<!-- Description -->
This is a prototype homepage for the band **Folk Ridge**.

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





