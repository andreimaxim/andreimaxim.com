require_relative "assembly"

Jekyll::Hooks.register([:documents, :posts, :pages], :post_render) do |document|
  Jekyll::DriveShaft::Assembly.assets.each do |url, asset|
    document.output.gsub!(url, asset.digested_url)
  end
end

Jekyll::Hooks.register(:site, :post_write) do
  Jekyll::DriveShaft::Assembly.fingerprint_assets!
end
