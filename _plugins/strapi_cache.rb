# Reuse Strapi content locally instead of downloading it for every template.
require "jekyll-strapi"

module LocalStrapiCache
  def each(&block)
    # Only cache during local development with `jekyll serve`.
    # `jekyll build` always uses the original plugin, even without JEKYLL_ENV.
    return super(&block) unless @site.config["serving"] && Jekyll.env == "development"

    cache = Jekyll::Cache.new("Strapi")
    # Different endpoints or collection settings must use different cache entries.
    key = [@site.endpoint, @collection_name, @config].to_json

    documents = cache.getset(key) do
      # This runs only when the collection has not been cached yet.
      entries = []
      super() { |document| entries << document }
      entries
    end

    documents.each(&block)
  end
end

# Wrap the existing method so the original plugin still handles fetching data.
Jekyll::Strapi::StrapiCollection.prepend(LocalStrapiCache)
