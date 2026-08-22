import Link from 'next/link'

interface TagChipProps {
  tag: string
  href?: string
  variant?: 'default' | 'outline'
}

export default function TagChip({ tag, href, variant = 'default' }: TagChipProps) {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-medium rounded-full transition-colors'
  const variantClasses = variant === 'default'
    ? 'bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/15'
    : 'border border-neutral-200 text-neutral-500 hover:bg-neutral-50'

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
