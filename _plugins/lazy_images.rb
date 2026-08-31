# 为论文与笔记正文里的所有 <img> 补 loading="lazy"。
# 浏览器据此将视口外图片推迟加载，减少初始请求数和 LCP 阻塞时间。
# 在 :post_convert 阶段（markdown → HTML，布局渲染前）处理 doc.output，
# 范围精确到文档正文，不影响布局模板中的任何元素。
Jekyll::Hooks.register :documents, :post_convert do |doc|
  next unless doc.output_ext == ".html"
  doc.output = doc.output.gsub(/<img ([^>]*?)(\s*\/?)>/) do
    attrs = Regexp.last_match(1)
    close = Regexp.last_match(2)
    next "<img #{attrs}#{close}>" if attrs.include?("loading=")
    "<img #{attrs.rstrip} loading=\"lazy\"#{close}>"
  end
end
