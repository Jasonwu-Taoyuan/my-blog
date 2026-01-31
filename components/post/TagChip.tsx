import Link from 'next/link'

interface TagChipProps {
  tag: string
  href?: string
  variant?: 'default' | 'outline'
}

export default function TagChip({ tag, href, variant = 'default' }: TagChipProps) {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-medium rounded-full transition-colors'
  const variantClasses = variant === 'default'
    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'

  const content = (
    <span className={`${baseClasses} ${variantClasses}`}>
      {tag}
    </span>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
