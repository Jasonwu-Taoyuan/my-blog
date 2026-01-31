import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Github, Linkedin, Mail, Globe, Facebook, Instagram } from 'lucide-react'

export const metadata = {
  title: 'About | My Blog',
  description: 'Learn more about me',
}

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  website: Globe,
  facebook: Facebook,
  instagram: Instagram,
}

export default async function AboutPage() {
  const about = await prisma.about.findFirst()

  if (!about) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>
        <p className="text-gray-600">No information available yet.</p>
      </div>
    )
  }

  const links = JSON.parse(about.links || '[]')
  const experience = about.experience ? JSON.parse(about.experience) : []
  const skills = about.skills ? JSON.parse(about.skills) : []

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {about.displayName}
      </h1>
      <p className="text-xl text-gray-600 mb-8">{about.headline}</p>

      {/* Social Links */}
      {links.length > 0 && (
        <div className="flex space-x-4 mb-12">
          {links.map((link: any, index: number) => {
            const Icon = iconMap[link.type as keyof typeof iconMap] || Globe
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                title={link.label || link.type}
              >
                <Icon className="h-5 w-5 text-gray-700" />
              </a>
            )
          })}
        </div>
      )}

      {/* Bio */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{about.bioMarkdown}</ReactMarkdown>
        </div>
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {exp.title}
                </h3>
                <div className="text-gray-600 mb-2">
                  {exp.organization} • {exp.startDate}
                  {exp.endDate ? ` - ${exp.endDate}` : ' - Present'}
                </div>
                {exp.description && (
                  <p className="text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
