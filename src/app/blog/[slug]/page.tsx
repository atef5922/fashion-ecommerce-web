import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <section className="container py-12 text-center lg:py-20">
        <p className="type-eyebrow text-luxury-burgundy">{post.category} / {post.readTime}</p>
        <h1 className="type-page-title mx-auto mt-4 max-w-4xl">{post.title}</h1>
        <p className="type-body-sm mt-5 text-muted-foreground">{post.author} / {post.publishedAt}</p>
      </section>
      <div className="relative h-[70vh]">
        <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
      </div>
      <section className="container max-w-3xl py-16">
        {post.content.map((paragraph) => (
          <p key={paragraph} className="type-body mb-7 text-muted-foreground">{paragraph}</p>
        ))}
      </section>
    </article>
  );
}
