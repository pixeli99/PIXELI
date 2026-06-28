# kramdown 的 smart_quotes 按"前一个字符是否为空白"判断引号开合，
# 中文里引号紧贴汉字（如 在"梦里"训）没有空白，于是两边都被误判成右引号，
# 渲染成 ”梦里” 这种方向错误的引号；行内数学 $[T', H', W']$ 里的 ' 也会被
# 错误转成 U+2019，让 KaTeX 认不出 prime 记号。直接关掉这个转换，
# 让引号原样输出，交给作者自己在源文本里写中文全角引号。
require "kramdown/parser/gfm"

module Kramdown
  module Parser
    class GFM
      module PixeliNoSmartQuotes
        def initialize(source, options)
          super
          @span_parsers.delete(:smart_quotes)
        end
      end
      prepend PixeliNoSmartQuotes
    end
  end
end
