require_relative "asset"

module Jekyll
  module DriveShaft
    class Assembly
      class << self
        def assets
          @@assets ||= {}
        end

        def add(url:, source_path:, destination_path:)
          assets[url] = Jekyll::DriveShaft::Asset.new(
            url: url,
            source_path: source_path,
            destination_path: destination_path
          )
        end

        def [](url)
          assets[url]
        end

        def fingerprint_assets!
          assets.values.each { |asset| asset.create_fingerprinted_copy! }
        end
      end
    end
  end
end

Jekyll::Hooks.register(:site, :pre_render) do |site|
  site.static_files_to_write.each do |file|
    Jekyll::DriveShaft::Assembly.add(
      url: file.url,
      source_path: file.path,
      destination_path: file.destination(site.dest)
    )
  end
end

Jekyll::Hooks.register([:documents, :posts, :pages], :post_render) do |document|
  Jekyll::DriveShaft::Assembly.assets.each do |url, asset|
    document.output.gsub!(url, asset.digested_url)
  end
end

Jekyll::Hooks.register(:site, :post_write) do
  Jekyll::DriveShaft::Assembly.fingerprint_assets!
end
