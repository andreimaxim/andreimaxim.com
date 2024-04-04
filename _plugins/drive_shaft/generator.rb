require_relative "assembly"

module Jekyll
  module DriveShaft
    class Generator < Generator
      safe true
      priority :low

      def generate(site)
        site.static_files_to_write.each do |file|
          Jekyll::DriveShaft::Assembly.add(
            url: file.url,
            source_path: file.path,
            destination_path: file.destination(site.dest)
          )
        end
      end
    end
  end
end
