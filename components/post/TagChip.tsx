import Link from 'next/link'

interface TagChipProps {
  tag: string
  href?: string
  variant?: 'default' | 'outline'
}

export default function TagChip({ tag, href, variant = 'default' }: TagChipProps) {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-medium rounded-full transition-colors'
  const variantClasses = variant === 'default'
    ? 'bg-slate-700/50 text-amber-400/80 hover:bg-slate-700'
    : 'border border-slate-600 text-slate-300 hover:bg-slate-800'

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
