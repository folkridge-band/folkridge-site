# Adapt the existing jekyll-strapi collection interface to Strapi v5.
# Layouts and Liquid component/media paths continue to use strapi.collections.
require 'jekyll-strapi'
require 'uri'
require 'net/http'

module FolkRidgeV5
  # Which images, components and relations to request for each collection.
  POPULATE = JSON.parse(File.read(File.join(__dir__, 'strapi_v5_populate.json'))).freeze
  # Imported members/contacts keep the same order as on your original site.
  DISPLAY_ORDER = JSON.parse(File.read(File.join(__dir__, 'strapi_v5_order.json'))).freeze

  # Turn nested query settings into URL keys such as populate[profile_image].
  def self.query_pairs(value, prefix = nil)
    case value
    when Hash
      value.flat_map do |key, child|
        child_prefix = prefix ? "#{prefix}[#{key}]" : key.to_s
        query_pairs(child, child_prefix)
      end
    when Array
      value.each_with_index.flat_map { |child, index| query_pairs(child, "#{prefix}[#{index}]") }
    else
      [[prefix, value.to_s]]
    end
  end
end

module Jekyll
  module Strapi
    class StrapiCollection
      # Replace the gem's v3 fetcher; the existing LocalStrapiCache still wraps it.
      def each
        return enum_for(:each) unless block_given?
        @v5_records ||= fetch_v5_records
        @v5_records.each { |document| yield document }
      end

      private

      # Eco dynos can return 503 while waking up. Retry only temporary failures.
      # Three attempts with short waits keep a real outage from hanging the build.
      def request_v5_page(uri, type)
        attempts = 0
        loop do
          attempts += 1
          begin
            http = Net::HTTP.new(uri.host, uri.port)
            http.use_ssl = uri.scheme == 'https'
            http.open_timeout = 5
            http.read_timeout = 45
            http.max_retries = 0 # Keep retries here so the attempt limit is explicit.
            request = Net::HTTP::Get.new(uri.request_uri, 'Accept' => 'application/json')
            response = http.request(request)
            return response unless %w[502 503 504].include?(response.code)
            reason = "HTTP #{response.code}"
          rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, Errno::ECONNRESET, Errno::ETIMEDOUT, EOFError => error
            reason = error.class.to_s
          end
          if attempts >= 3
            raise "Strapi v5 #{type}: #{reason} after #{attempts} attempts at #{uri.host}. Check the Strapi server."
          end
          wait_seconds = attempts * 5
          Jekyll.logger.warn 'Strapi v5:', "#{type}: #{reason}; retrying in #{wait_seconds}s (attempt #{attempts + 1}/3)."
          sleep wait_seconds
        end
      end

      def fetch_v5_records
        endpoint = @site.endpoint.to_s.sub(%r{/+$}, '')
        raise 'Strapi v5 endpoint must end in /api.' unless endpoint.end_with?('/api')
        type = @config['type'] || @collection_name
        page_number = 1
        documents = []
        seen_document_ids = {}
        loop do
          # v5 returns one page at a time; populate adds images and nested content.
          query = { 'pagination' => { 'page' => page_number, 'pageSize' => 100 }, 'sort' => ['id:asc'] }
          population = FolkRidgeV5::POPULATE.fetch(type, {})
          query['populate'] = population unless population.empty?
          uri = URI("#{endpoint}/#{type}")
          uri.query = URI.encode_www_form(FolkRidgeV5.query_pairs(query))
          Jekyll.logger.info 'Strapi v5:', "Fetching #{endpoint}/#{type}, page #{page_number}"
          response = request_v5_page(uri, type)
          unless response.code == '200'
            hint = %w[401 403].include?(response.code) ? 'Check Public role find permissions.' : 'Check the API endpoint and Strapi server logs.'
            raise "Strapi v5 #{type}: HTTP #{response.code}. #{hint}"
          end
          # v5 records live in data; page counts live in meta.pagination.
          payload = JSON.parse(response.body)
          records = payload.fetch('data')
          raise "Strapi v5 #{type}: expected a data array." unless records.is_a?(Array)
          pagination = payload.fetch('meta').fetch('pagination')
          display_order = FolkRidgeV5::DISPLAY_ORDER.fetch(type, {})
          records.each do |record|
            document_id = record.fetch('documentId')
            raise "Strapi v5 #{type}: duplicate document across pages." if seen_document_ids[document_id]
            seen_document_ids[document_id] = true
            # Keep the original gem's Liquid paths, including member.profile_image.url.
            document = JSON.parse(JSON.generate(record), object_class: OpenStruct)
            document.type = @collection_name
            document.collection = @collection_name
            document.url = @site.strapi_link_resolver(@collection_name, document)
            # New records follow the imported items instead of reshuffling the site.
            document.website_order = display_order.fetch(document_id, 100_000 + record.fetch('id'))
            documents << document
          end
          break if page_number >= Integer(pagination.fetch('pageCount'))
          raise "Strapi v5 #{type}: empty intermediate page." if records.empty?
          page_number += 1
          raise "Strapi v5 #{type}: pagination limit exceeded." if page_number > 1000
        end
        documents
      end
    end
  end
end

# Use the local URL in _config.yml unless an environment supplies the hosted v5 API.
# On Netlify later: STRAPI_API_URL=https://your-new-heroku-app/api
Jekyll::Hooks.register :site, :after_init do |site|
  api_url = ENV['STRAPI_API_URL'].to_s.strip
  site.config['strapi']['endpoint'] = api_url.sub(%r{/+$}, '') unless api_url.empty?
end

# A production rebuild in the same Ruby process must not reuse the previous fetch.
Jekyll::Hooks.register :site, :after_reset do |site|
  collections = site.instance_variable_get(:@strapi_collections)
  collections&.each_value do |collection|
    collection.remove_instance_variable(:@v5_records) if collection.instance_variable_defined?(:@v5_records)
  end
end
