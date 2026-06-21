import type { BlogPost } from "@/types/blog";
import { fashionImages } from "./images";

export const blogPosts: BlogPost[] = [
  {
    id: "b-001",
    slug: "the-return-of-soft-tailoring",
    title: "The Return of Soft Tailoring",
    excerpt: "How relaxed suiting became the sharpest way to dress for modern days.",
    category: "Style",
    image: fashionImages.journal.tailoring,
    author: "Mira Hale",
    publishedAt: "May 18, 2026",
    readTime: "4 min read",
    content: [
      "Soft tailoring is the answer to wardrobes that need elegance without stiffness. The modern blazer has loosened its shoulder, lengthened its line, and found a fresh place between formal dressing and everyday ease.",
      "The key is contrast: pair a structured jacket with fluid trousers, a satin skirt, or clean denim. Keep the color palette deliberate and let texture do the quiet work."
    ]
  },
  {
    id: "b-002",
    slug: "building-a-capsule-that-feels-personal",
    title: "Building a Capsule That Feels Personal",
    excerpt: "A practical guide to owning less while expressing more.",
    category: "Wardrobe",
    image: fashionImages.journal.capsule,
    author: "Nadia Rafi",
    publishedAt: "May 26, 2026",
    readTime: "5 min read",
    content: [
      "A capsule wardrobe should never feel like a uniform. Start with silhouettes you actually reach for, then refine color, fabric, and proportion.",
      "Choose pieces that repeat well together: an ivory knit, black trouser, soft blazer, great shirt, leather bag, and one piece that feels unmistakably yours."
    ]
  },
  {
    id: "b-003",
    slug: "linen-stories-for-warmer-days",
    title: "Linen Stories for Warmer Days",
    excerpt: "The season's easiest fabric is also its most quietly luxurious.",
    category: "Materials",
    image: fashionImages.journal.linen,
    author: "Sami Karim",
    publishedAt: "June 1, 2026",
    readTime: "3 min read",
    content: [
      "Linen looks best when it is allowed to be itself. The faint texture, soft crease, and breathable hand are part of its charm.",
      "For a premium finish, balance linen with polished leather, minimal jewelry, and intentional color blocking."
    ]
  }
];
