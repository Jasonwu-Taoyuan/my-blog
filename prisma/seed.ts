import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log('✓ Created admin user:', admin.email)

  // Create sample post
  await prisma.post.upsert({
    where: { slug: 'welcome-to-my-blog' },
    update: {},
    create: {
      title: 'Welcome to My Blog',
      slug: 'welcome-to-my-blog',
      summary: 'This is my first blog post. Welcome!',
      content: `# Welcome!

This is my first blog post. I'm excited to share my thoughts and ideas with you.

## What to Expect

- Technology insights
- Development tips
- Personal reflections

Stay tuned for more content!`,
      tags: JSON.stringify(['welcome', 'introduction']),
      status: 'published',
      publishedAt: new Date(),
      readingTimeMinutes: 2,
      authorId: admin.id,
    },
  })

  console.log('✓ Created sample post')

  // Create About page
  await prisma.about.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      displayName: 'Your Name',
      headline: 'Developer | Writer | Creator',
      bioMarkdown: `Hi! I'm a passionate developer and writer.

I love building things and sharing knowledge with the community.`,
      links: JSON.stringify([
        { type: 'github', url: 'https://github.com' },
        { type: 'linkedin', url: 'https://linkedin.com' },
        { type: 'email', url: 'mailto:hello@example.com' },
      ]),
      skills: JSON.stringify([
        'JavaScript',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
      ]),
    },
  })

  console.log('✓ Created About page')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
