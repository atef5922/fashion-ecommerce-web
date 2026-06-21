import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="mt-5">
          <p className="type-eyebrow text-[0.62rem] text-luxury-burgundy">{post.category} / {post.readTime}</p>
          <h2 className="type-card-title mt-2">{post.title}</h2>
          <p className="type-body-sm mt-3 text-muted-foreground">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
