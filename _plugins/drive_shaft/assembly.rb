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
