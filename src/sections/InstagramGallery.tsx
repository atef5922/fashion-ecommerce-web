import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fashionImages } from "@/data/images";

export function InstagramGallery() {
  return (
    <section className="bg-[#11100f] py-5 text-white md:py-8">
      <div className="luxury-container">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eyebrow text-luxury-gold">Seen in rotation</p>
            <h2 className="type-subsection-title mt-3 text-white">Real outfit energy, editorially cropped.</h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-ink">
              Shop the feed <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {fashionImages.social.map((image, index) => (
            <div key={image} className={`group relative overflow-hidden ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
              <div className={index === 0 ? "relative aspect-square md:aspect-[1.05/1]" : "relative aspect-square"}>
                <Image src={image} alt={`Mugnee social editorial ${index + 1}`} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/28" />
                <span className="absolute bottom-3 left-3 fine-label text-white/0 transition group-hover:text-white/80">Look 0{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
