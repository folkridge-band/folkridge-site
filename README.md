<!-- Heading -->
# Folk Ridge Homepage Prototype

<!-- Description -->
This is a prototype homepage for the band **Folk Ridge**.

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
- `super()` calls the original Strapi plugin to download and prepare documents.
- `documents.each(&block)` passes those documents back to the template as usual.

`jekyll build` bypasses this cache and fetches fresh content, even when
`JEKYLL_ENV` is unset. Serving in production mode also bypasses it. No changes to
the deployment command or environment are needed for this caching feature.





