# 为论文与笔记正文里的所有 <img> 补 loading="lazy" 和 decoding="async"。
# loading=lazy：将视口外图片推迟加载，减少初始请求数和 LCP 阻塞时间。
# decoding=async：图片解码在主线程外进行，不阻塞渲染与交互响应。
# 在 :post_convert 阶段（markdown → HTML，布局渲染前）修改 doc.content，
# 范围精确到文档正文，不影响布局模板中的任何元素。
# 注：:post_convert 时 doc.output 尚未赋值（layout 渲染后才写入），
# 应读写 doc.content（已完成 Markdown → HTML 转换的正文）。
Jekyll::Hooks.register :documents, :post_convert do |doc|
  next unless doc.output_ext == ".html"
  next if doc.content.nil?
  doc.content = doc.content.gsub(/<img ([^>]*?)(\s*\/?)>/) do
    attrs = Regexp.last_match(1)
    close = Regexp.last_match(2)
    next "<img #{attrs}#{close}>" if attrs.include?("loading=")
    extra = "loading=\"lazy\""
    extra += " decoding=\"async\"" unless attrs.include?("decoding=")
    "<img #{attrs.rstrip} #{extra}#{close}>"
  end
end
