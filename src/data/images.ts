const unsplash = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?q=85&w=${width}&auto=format&fit=crop`;

export const fashionImages = {
  hero: {
    main: unsplash("photo-1483985988355-763728e1935b", 2200),
    feature: unsplash("photo-1515886657613-9f3515b0c78f", 1000)
  },
  campaigns: {
    tailoring: unsplash("photo-1543076447-215ad9ba6923", 1900),
    sale: unsplash("photo-1483985988355-763728e1935b", 1500),
    newsletter: unsplash("photo-1503342217505-b0a15ec3261c", 1900),
    about: unsplash("photo-1445205170230-053b83016050", 1900),
    look: unsplash("photo-1509631179647-0177331693ae", 1600)
  },
  categories: {
    women: unsplash("photo-1529139574466-a303027c1d8b", 1300),
    men: unsplash("photo-1516826957135-700dedea698c", 1300),
    kids: unsplash("photo-1503919545889-aef636e10ad4", 1300),
    accessories: unsplash("photo-1594223274512-ad4803739b7c", 1300)
  },
  products: {
    satinDress: [
      unsplash("photo-1496747611176-843222e1e57c", 1300),
      unsplash("photo-1515886657613-9f3515b0c78f", 1300)
    ],
    woolBlazer: [
      unsplash("photo-1543076447-215ad9ba6923", 1300),
      unsplash("photo-1483985988355-763728e1935b", 1300)
    ],
    linenShirt: [
      unsplash("photo-1516826957135-700dedea698c", 1300),
      unsplash("photo-1506629905607-d9bc297d48d5", 1300)
    ],
    pleatTrouser: [
      unsplash("photo-1516257984-b1b4d707412e", 1300),
      unsplash("photo-1507680434567-5739c80be1ac", 1300)
    ],
    cardigan: [
      unsplash("photo-1434389677669-e08b4cac3105", 1300),
      unsplash("photo-1529139574466-a303027c1d8b", 1300)
    ],
    shoulderBag: [
      unsplash("photo-1594223274512-ad4803739b7c", 1300),
      unsplash("photo-1585518126763-5146ad8837a0", 1300)
    ]
  },
  collections: {
    evening: unsplash("photo-1515886657613-9f3515b0c78f", 1300),
    linen: unsplash("photo-1506629905607-d9bc297d48d5", 1300),
    accessories: unsplash("photo-1594223274512-ad4803739b7c", 1300)
  },
  journal: {
    tailoring: unsplash("photo-1487222477894-8943e31ef7b2", 1300),
    capsule: unsplash("photo-1445205170230-053b83016050", 1300),
    linen: unsplash("photo-1506629905607-d9bc297d48d5", 1300)
  },
  social: [
    unsplash("photo-1496747611176-843222e1e57c", 700),
    unsplash("photo-1529139574466-a303027c1d8b", 700),
    unsplash("photo-1543076447-215ad9ba6923", 700),
    unsplash("photo-1516826957135-700dedea698c", 700),
    unsplash("photo-1594223274512-ad4803739b7c", 700)
  ]
} as const;
