import type { NavItem } from "@/types/navigation";
import { fashionImages } from "./images";

export const navigation: NavItem[] = [
  {
    label: "Women",
    href: "/shop?category=Women",
    featured: fashionImages.categories.women,
    featuredLabel: "Borno women",
    featuredTitle: "Curated signatures for modern dressing",
    featuredHref: "/shop?category=Women",
    children: [
      { label: "Saree", href: "/shop?category=Women&type=saree" },
      { label: "Salwar Kameez", href: "/shop?category=Women&type=salwar-kameez" },
      { label: "Kurti", href: "/shop?category=Women&type=kurti" },
      { label: "Tops", href: "/shop?category=Women&type=tops" },
      { label: "Pants", href: "/shop?category=Women&type=pants" },
      { label: "Bags", href: "/shop?category=Women&type=bags" },
      { label: "Shoes", href: "/shop?category=Women&type=shoes" },
      { label: "Jewellery", href: "/shop?category=Women&type=jewellery" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Ready to wear",
            links: [
              { label: "Saree", href: "/shop?category=Women&type=saree" },
              { label: "Salwar Kameez", href: "/shop?category=Women&type=salwar-kameez" },
              { label: "Kurti", href: "/shop?category=Women&type=kurti" },
              { label: "Tops", href: "/shop?category=Women&type=tops" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Tailoring",
            links: [
              { label: "Pants", href: "/shop?category=Women&type=pants" },
              { label: "Jackets", href: "/shop?category=Women&type=jackets" },
              { label: "Workwear", href: "/shop?category=Women&type=workwear" }
            ]
          },
          {
            heading: "Accessories",
            links: [
              { label: "Bags", href: "/shop?category=Women&type=bags" },
              { label: "Shoes", href: "/shop?category=Women&type=shoes" },
              { label: "Jewellery", href: "/shop?category=Women&type=jewellery" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Men",
    href: "/shop?category=Men",
    featured: fashionImages.categories.men,
    featuredLabel: "Borno men",
    featuredTitle: "Crafted essentials with a sharper point of view",
    featuredHref: "/shop?category=Men",
    children: [
      { label: "Panjabi", href: "/shop?category=Men&type=panjabi" },
      { label: "Shirt", href: "/shop?category=Men&type=shirt" },
      { label: "T-Shirt", href: "/shop?category=Men&type=t-shirt" },
      { label: "Polo", href: "/shop?category=Men&type=polo" },
      { label: "Pants", href: "/shop?category=Men&type=pants" },
      { label: "Shoes", href: "/shop?category=Men&type=shoes" },
      { label: "Wallet", href: "/shop?category=Men&type=wallet" },
      { label: "Accessories", href: "/shop?category=Men&type=accessories" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Clothing",
            links: [
              { label: "Panjabi", href: "/shop?category=Men&type=panjabi" },
              { label: "Shirt", href: "/shop?category=Men&type=shirt" },
              { label: "T-Shirt", href: "/shop?category=Men&type=t-shirt" },
              { label: "Polo", href: "/shop?category=Men&type=polo" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Essentials",
            links: [
              { label: "Pants", href: "/shop?category=Men&type=pants" },
              { label: "Shoes", href: "/shop?category=Men&type=shoes" },
              { label: "Wallet", href: "/shop?category=Men&type=wallet" },
              { label: "Accessories", href: "/shop?category=Men&type=accessories" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Kids",
    href: "/shop?category=Kids",
    featured: fashionImages.categories.kids,
    featuredLabel: "Borno kids",
    featuredTitle: "Playful pieces with comfort-first styling",
    featuredHref: "/shop?category=Kids",
    children: [
      { label: "Girls Clothing", href: "/shop?category=Kids&type=girls-clothing" },
      { label: "Boys Clothing", href: "/shop?category=Kids&type=boys-clothing" },
      { label: "Newborn", href: "/shop?category=Kids&type=newborn" },
      { label: "Shoes", href: "/shop?category=Kids&type=shoes" },
      { label: "Toys", href: "/shop?category=Kids&type=toys" },
      { label: "Accessories", href: "/shop?category=Kids&type=accessories" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Collections",
            links: [
              { label: "Girls Clothing", href: "/shop?category=Kids&type=girls-clothing" },
              { label: "Boys Clothing", href: "/shop?category=Kids&type=boys-clothing" },
              { label: "Newborn", href: "/shop?category=Kids&type=newborn" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Play and style",
            links: [
              { label: "Shoes", href: "/shop?category=Kids&type=shoes" },
              { label: "Toys", href: "/shop?category=Kids&type=toys" },
              { label: "Accessories", href: "/shop?category=Kids&type=accessories" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Home Decor",
    href: "/shop?category=Home%20Decor",
    featured: fashionImages.campaigns.about,
    featuredLabel: "Borno home",
    featuredTitle: "Quiet objects for beautifully considered rooms",
    featuredHref: "/shop?category=Home%20Decor",
    children: [
      { label: "Cushions", href: "/shop?category=Home%20Decor&type=cushions" },
      { label: "Bedding", href: "/shop?category=Home%20Decor&type=bedding" },
      { label: "Tableware", href: "/shop?category=Home%20Decor&type=tableware" },
      { label: "Decor accents", href: "/shop?category=Home%20Decor&type=decor-accents" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Living",
            links: [
              { label: "Cushions", href: "/shop?category=Home%20Decor&type=cushions" },
              { label: "Throws", href: "/shop?category=Home%20Decor&type=throws" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Dining and bedroom",
            links: [
              { label: "Bedding", href: "/shop?category=Home%20Decor&type=bedding" },
              { label: "Tableware", href: "/shop?category=Home%20Decor&type=tableware" },
              { label: "Decor accents", href: "/shop?category=Home%20Decor&type=decor-accents" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Jewellery",
    href: "/shop?category=Jewellery",
    featured: fashionImages.categories.accessories,
    featuredLabel: "Borno jewellery",
    featuredTitle: "Layered ornament designed to finish the occasion",
    featuredHref: "/shop?category=Jewellery",
    children: [
      { label: "Earrings", href: "/shop?category=Jewellery&type=earrings" },
      { label: "Necklaces", href: "/shop?category=Jewellery&type=necklaces" },
      { label: "Bracelets & Bangles", href: "/shop?category=Jewellery&type=bracelets" },
      { label: "Rings", href: "/shop?category=Jewellery&type=rings" },
      { label: "Nose Pins", href: "/shop?category=Jewellery&type=nose-pins" },
      { label: "Anklets", href: "/shop?category=Jewellery&type=anklets" },
      { label: "Lockets & Pendants", href: "/shop?category=Jewellery&type=lockets-pendants" },
      { label: "Hair Accessories", href: "/shop?category=Jewellery&type=hair-accessories" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Earrings",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=earrings&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=earrings&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=earrings&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=earrings&material=fashion" },
              { label: "Gold-plated", href: "/shop?category=Jewellery&type=earrings&material=gold-plated" }
            ]
          },
          {
            heading: "Necklaces",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=necklaces&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=necklaces&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=necklaces&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=necklaces&material=fashion" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Necklace Sets",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=necklace-sets&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=necklace-sets&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=necklace-sets&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=necklace-sets&material=fashion" }
            ]
          },
          {
            heading: "Bracelets & Bangles",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=bracelets&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=bracelets&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=bracelets&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=bracelets&material=fashion" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Rings",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=rings&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=rings&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=rings&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=rings&material=fashion" }
            ]
          },
          {
            heading: "Nose Pins",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=nose-pins&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=nose-pins&material=gold" }
            ]
          },
          {
            heading: "Toe Rings",
            links: [
              { label: "View all", href: "/shop?category=Jewellery&type=toe-rings" }
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: "Anklets",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=anklets&material=silver" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=anklets&material=fashion" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=anklets&material=pearl" }
            ]
          },
          {
            heading: "Lockets & Pendants",
            links: [
              { label: "Silver", href: "/shop?category=Jewellery&type=lockets-pendants&material=silver" },
              { label: "Gold", href: "/shop?category=Jewellery&type=lockets-pendants&material=gold" },
              { label: "Pearl", href: "/shop?category=Jewellery&type=lockets-pendants&material=pearl" },
              { label: "Fashion", href: "/shop?category=Jewellery&type=lockets-pendants&material=fashion" }
            ]
          },
          {
            heading: "Hair Accessories",
            links: [{ label: "Shop now", href: "/shop?category=Jewellery&type=hair-accessories" }]
          },
          {
            heading: "Jewellery Box",
            links: [{ label: "Shop now", href: "/shop?category=Jewellery&type=jewellery-box" }]
          }
        ]
      }
    ]
  },
  {
    label: "Skin & Hair",
    href: "/shop?category=Skin%20%26%20Hair",
    featured: fashionImages.campaigns.newsletter,
    featuredLabel: "Borno beauty",
    featuredTitle: "Daily rituals for skin, scent, and polished hair",
    featuredHref: "/shop?category=Skin%20%26%20Hair",
    children: [
      { label: "Skincare", href: "/shop?category=Skin%20%26%20Hair&type=skincare" },
      { label: "Haircare", href: "/shop?category=Skin%20%26%20Hair&type=haircare" },
      { label: "Fragrance", href: "/shop?category=Skin%20%26%20Hair&type=fragrance" },
      { label: "Wellness", href: "/shop?category=Skin%20%26%20Hair&type=wellness" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Beauty rituals",
            links: [
              { label: "Skincare", href: "/shop?category=Skin%20%26%20Hair&type=skincare" },
              { label: "Haircare", href: "/shop?category=Skin%20%26%20Hair&type=haircare" },
              { label: "Fragrance", href: "/shop?category=Skin%20%26%20Hair&type=fragrance" },
              { label: "Wellness", href: "/shop?category=Skin%20%26%20Hair&type=wellness" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Gifts & Crafts",
    href: "/shop?category=Gifts%20%26%20Crafts",
    featured: fashionImages.campaigns.look,
    featuredLabel: "Borno gifting",
    featuredTitle: "Thoughtful pieces for celebrations and keepsakes",
    featuredHref: "/shop?category=Gifts%20%26%20Crafts",
    children: [
      { label: "Gift sets", href: "/shop?category=Gifts%20%26%20Crafts&type=gift-sets" },
      { label: "Handcrafted decor", href: "/shop?category=Gifts%20%26%20Crafts&type=handcrafted-decor" },
      { label: "Candles", href: "/shop?category=Gifts%20%26%20Crafts&type=candles" },
      { label: "Keepsakes", href: "/shop?category=Gifts%20%26%20Crafts&type=keepsakes" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Gift ideas",
            links: [
              { label: "Gift sets", href: "/shop?category=Gifts%20%26%20Crafts&type=gift-sets" },
              { label: "Handcrafted decor", href: "/shop?category=Gifts%20%26%20Crafts&type=handcrafted-decor" },
              { label: "Candles", href: "/shop?category=Gifts%20%26%20Crafts&type=candles" },
              { label: "Keepsakes", href: "/shop?category=Gifts%20%26%20Crafts&type=keepsakes" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Wedding",
    href: "/shop?category=Wedding",
    featured: fashionImages.campaigns.tailoring,
    featuredLabel: "Borno wedding",
    featuredTitle: "Occasion dressing shaped for ceremony and celebration",
    featuredHref: "/shop?category=Wedding",
    children: [
      { label: "Bride", href: "/shop?category=Wedding&type=bride" },
      { label: "Groom", href: "/shop?category=Wedding&type=groom" },
      { label: "Guests", href: "/shop?category=Wedding&type=guests" },
      { label: "Accessories", href: "/shop?category=Wedding&type=accessories" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "Occasion edits",
            links: [
              { label: "Bride", href: "/shop?category=Wedding&type=bride" },
              { label: "Groom", href: "/shop?category=Wedding&type=groom" },
              { label: "Guests", href: "/shop?category=Wedding&type=guests" },
              { label: "Accessories", href: "/shop?category=Wedding&type=accessories" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "Brands",
    href: "/about",
    featured: fashionImages.campaigns.about,
    featuredLabel: "Borno house",
    featuredTitle: "A Bangladesh fashion house rooted in modern craft",
    featuredHref: "/about",
    children: [
      { label: "About BORNO", href: "/about" },
      { label: "Journal", href: "/blog" },
      { label: "Client care", href: "/contact" }
    ],
    columns: [
      {
        sections: [
          {
            heading: "House",
            links: [
              { label: "About BORNO", href: "/about" },
              { label: "Journal", href: "/blog" },
              { label: "Client care", href: "/contact" }
            ]
          }
        ]
      }
    ]
  }
];
