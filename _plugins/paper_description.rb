# 论文笔记正文以 "## 一句话" 开头，Jekyll 默认按首个空行截取 excerpt，
# 结果只截到标题本身，导致 meta description / og:description 全部显示成
# "一句话" 四个字。这里直接从渲染后的 HTML 里把那一段实际内容抠出来，
# 写回 doc.data["description"]，jekyll-seo-tag 会优先读这个字段。
Jekyll::Hooks.register :documents, :post_convert do |doc|
  next unless doc.collection.label == "papers"
  next if doc.data["description"]

  match = doc.content.to_s.match(%r{<h2[^>]*>一句话</h2>(.*?)(?=<h2|\z)}m)
  next unless match

  text = match[1]
    .gsub(%r{<[^>]+>}, "")
    .gsub(/\$\$[\s\S]+?\$\$/, "")
    .gsub(/\$([^$\n]+)\$/) { $1.gsub(/\\[a-zA-Z]+/, "").gsub(/[{}]/, "").strip }
    .gsub(/\s+/, " ")
    .strip
  doc.data["description"] = text unless text.empty?
end
