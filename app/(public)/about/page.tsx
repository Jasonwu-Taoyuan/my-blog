import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import { Github, Linkedin, Mail, Globe, Facebook, Instagram, Briefcase } from 'lucide-react'

export const metadata = {
  title: '關於我 | My Blog',
  description: '認識 Jason：營運管理、讀書筆記、旅遊足跡與運動觀察',
}

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  website: Globe,
  facebook: Facebook,
  instagram: Instagram,
}

const ROW_COLORS = ['var(--accent)', 'var(--emerald)', 'var(--purple)', 'var(--sky)']

export default async function AboutPage() {
  const about = await prisma.about.findFirst()

  if (!about) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-neutral-900">關於我</h1>
        <p className="text-neutral-400 mt-4">尚未設定個人資料。</p>
      </div>
    )
  }

  const links = JSON.parse(about.links || '[]')
  const experience = about.experience ? JSON.parse(about.experience) : []
  const skills = about.skills ? JSON.parse(about.skills) : []

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 720 }}>
      {/* Hero */}
      <div className="flex flex-col items-center text-center pt-8 pb-8">
        <div
          className="w-24 h-24 rounded-full border border-neutral-200/70 flex items-center justify-center text-3xl font-bold text-neutral-900 mb-6"
          style={{ background: 'linear-gradient(160deg, #f0f0f2, #e2e2e6)' }}
        >
          {about.displayName?.[0] || '?'}
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-1">
          {about.displayName}
        </h1>
        {about.headline && (
          <p className="text-base font-semibold mb-5" style={{ color: 'var(--accent)' }}>{about.headline}</p>
        )}

        {links.length > 0 && (
          <div className="flex gap-2.5">
            {links.map((link: any, index: number) => {
              const Icon = iconMap[link.type as keyof typeof iconMap] || Globe
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  title={link.label || link.type}
                >
                  <Icon className="h-[18px] w-[18px] text-neutral-500" />
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Bio */}
      <section className="py-8 border-t border-neutral-200/70">
        <div className="prose max-w-none text-center mx-auto" style={{ maxWidth: 560 }}>
          <ReactMarkdown>{about.bioMarkdown}</ReactMarkdown>
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="py-8 border-t border-neutral-200/70">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3.5 px-1">專長</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-neutral-100 text-neutral-900 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="py-8 border-t border-neutral-200/70">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3.5 px-1">經歷</h2>
          <div className="flex flex-col bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden">
            {experience.map((exp: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3.5 px-[18px] py-4 relative"
                style={index > 0 ? { borderTop: '.5px solid rgba(0,0,0,.08)' } : undefined}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ background: ROW_COLORS[index % ROW_COLORS.length] }}
                >
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-neutral-900">{exp.title}</div>
                  <div className="text-sm text-neutral-400 mt-0.5">
                    {exp.organization}
                    {exp.startDate && <> ・ {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ' - 現在'}</>}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-neutral-500 mt-1">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
