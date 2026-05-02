import { GitBranch, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-sidebar)',
    }}>
      <div className="container mx-auto px-4 py-6" style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 24, height: 24,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(217,119,6,.3)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>📖</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              © {new Date().getFullYear()} Jason&apos;s Blog
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a
              href="https://github.com/Jasonwu-Taoyuan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-social-btn"
            >
              <GitBranch style={{ width: 14, height: 14 }} />
            </a>
            <a
              href="mailto:cm.wu2006@gmail.com"
              aria-label="Email"
              className="footer-social-btn"
            >
              <Mail style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
