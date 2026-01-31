import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

export const markdownOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeRaw, rehypeSanitize],
}
