import PostCard from './PostCard'

interface PostListProps {
  posts: Array<{
    id: string
    slug: string
    title: string
    summary: string
    coverImageUrl?: string | null
    tags: string[]
    publishedAt?: Date | null
    readingTimeMinutes: number
  }>
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
