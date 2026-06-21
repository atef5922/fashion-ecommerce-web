import { blogPosts } from "@/data/blogPosts";
import { BlogCard } from "@/components/blog/BlogCard";

export default function BlogPage() {
  return (
    <div className="container py-16 lg:py-24">
      <p className="type-eyebrow text-luxury-burgundy">Journal</p>
      <h1 className="type-page-title mt-3">Editorial Notes</h1>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {blogPosts.map((post) => <BlogCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
