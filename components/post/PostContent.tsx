import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => (
            <span className="block my-4">
              <Image
                src={String(props.src || '')}
                alt={String(props.alt || '')}
                width={800}
                height={500}
                className="rounded-lg"
              />
            </span>
          ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 hover:underline"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
