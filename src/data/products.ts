export const products = [
  // Vêtements Bébé
  {
    id: 1001,
    title: "Body Bébé Coton Bio Manche Courte",
    description: "Body 0-3 mois en coton bio ultra doux, boutons pression.",
    category: "Vêtements Bébé",
    type: "vêtement",
    sizes: ["0-3m", "3-6m", "6-9m"],
    size: "0-3m",
    images: [
      "https://images.unsplash.com/photo-1540924787895-2c2a3fc54f09?w=800",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800"
    ],
    stock: "120",
    price: 5900,
    prevprice: 6900,
    qty: 1,
    discount: 14.5,
    totalprice: 5900,
    rating: { rate: 0, count: 0 }
  },
  {
    id: 1002,
    title: "Grenouillère Bébé Zippée",
    description: "Pyjama une pièce 3-6 mois, zip inversé, coton respirant.",
    category: "Vêtements Bébé",
    type: "vêtement",
    sizes: ["0-3m", "3-6m", "6-9m"],
    size: "3-6m",
    images: [
      "https://images.unsplash.com/photo-1585577529540-5d7a4b1c2b38?w=800"
    ],
    stock: "80",
    price: 9900,
    prevprice: 11900,
    qty: 1,
    discount: 16.8,
    totalprice: 9900,
    rating: { rate: 0, count: 0 }
  },

  // Vêtements Enfant Fille
  {
    id: 1101,
    title: "Robe Fille Fleurie",
    description: "Robe légère 4-6 ans, tissu coton, motif floral.",
    category: "Vêtements Enfant Fille",
    type: "vêtement",
    sizes: ["2-3a", "4-6a", "7-9a", "10-12a"],
    size: "4-6a",
    images: [
      "https://images.unsplash.com/photo-1562158070-4b55f6c6fc5c?w=800"
    ],
    stock: "60",
    price: 14900,
    prevprice: 17900,
    qty: 1,
    discount: 16.8,
    totalprice: 14900,
    rating: { rate: 0, count: 0 }
  },
  {
    id: 1102,
    title: "T-shirt Fille Arc-en-ciel",
    description: "T-shirt coton 7-9 ans, impression arc-en-ciel durable.",
    category: "Vêtements Enfant Fille",
    type: "vêtement",
    sizes: ["4-6a", "7-9a", "10-12a"],
    size: "7-9a",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
    ],
    stock: "100",
    price: 7900,
    prevprice: 8900,
    qty: 1,
    discount: 11.2,
    totalprice: 7900,
    rating: { rate: 0, count: 0 }
  },

  // Vêtements Enfant Garçon
  {
    id: 1201,
    title: "Short Garçon Denim",
    description: "Short en jean 7-9 ans, taille ajustable.",
    category: "Vêtements Enfant Garçon",
    type: "vêtement",
    sizes: ["4-6a", "7-9a", "10-12a"],
    size: "7-9a",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
    ],
    stock: "75",
    price: 12900,
    prevprice: 14900,
    qty: 1,
    discount: 13.4,
    totalprice: 12900,
    rating: { rate: 0, count: 0 }
  },
  {
    id: 1202,
    title: "Polo Garçon Coton",
    description: "Polo manches courtes 10-12 ans, col côtelé.",
    category: "Vêtements Enfant Garçon",
    type: "vêtement",
    sizes: ["4-6a", "7-9a", "10-12a"],
    size: "10-12a",
    images: [
      "https://images.unsplash.com/photo-1503342394123-480259ab8a32?w=800"
    ],
    stock: "90",
    price: 9900,
    prevprice: 11900,
    qty: 1,
    discount: 16.8,
    totalprice: 9900,
    rating: { rate: 0, count: 0 }
  },

  // Chaussures Enfant
  {
    id: 1301,
    title: "Baskets Enfant Respirantes",
    description: "Baskets légères, semelle antidérapante, pointures 28-35.",
    category: "Chaussures Enfant",
    type: "chaussure",
    sizes: ["28", "29", "30", "31", "32", "33", "34", "35"],
    size: "31",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
    ],
    stock: "50",
    price: 19900,
    prevprice: 22900,
    qty: 1,
    discount: 13.1,
    totalprice: 19900,
    rating: { rate: 0, count: 0 }
  },

  // Accessoires Enfant
  {
    id: 1401,
    title: "Casquette Enfant UV50+",
    description: "Casquette protection solaire, tour de tête ajustable.",
    category: "Accessoires Enfant",
    type: "accessoire",
    sizes: ["S", "M", "L"],
    size: "M",
    images: [
      "https://images.unsplash.com/photo-1520975693416-35a1cb4c3e9a?w=800"
    ],
    stock: "110",
    price: 5900,
    prevprice: 6900,
    qty: 1,
    discount: 14.5,
    totalprice: 5900,
    rating: { rate: 0, count: 0 }
  },

  // Jouets Éveil
  {
    id: 1501,
    title: "Cubes d'Éveil en Bois",
    description: "Set de 20 cubes en bois, 0-3 ans, peinture à l'eau.",
    category: "Jouets Éveil",
    type: "jouet",
    sizes: ["unité"],
    size: "unité",
    images: [
      "https://images.unsplash.com/photo-1549921296-3a6b6f6c59be?w=800"
    ],
    stock: "140",
    price: 9900,
    prevprice: 11900,
    qty: 1,
    discount: 16.8,
    totalprice: 9900,
    rating: { rate: 0, count: 0 }
  },
  {
    id: 1502,
    title: "Tapis d'Éveil Pliant",
    description: "Tapis mousse pliable, motifs animaux, 0-3 ans.",
    category: "Jouets Éveil",
    type: "jouet",
    sizes: ["unité"],
    size: "unité",
    images: [
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800"
    ],
    stock: "45",
    price: 29900,
    prevprice: 34900,
    qty: 1,
    discount: 14.3,
    totalprice: 29900,
    rating: { rate: 0, count: 0 }
  },

  // Jouets Créatifs
  {
    id: 1601,
    title: "Kit Pâte à Modeler Non Toxique",
    description: "6 pots de pâte à modeler, 3+, sans gluten.",
    category: "Jouets Créatifs",
    type: "jouet",
    sizes: ["pack"],
    size: "pack",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800"
    ],
    stock: "90",
    price: 8900,
    prevprice: 10900,
    qty: 1,
    discount: 18.3,
    totalprice: 8900,
    rating: { rate: 0, count: 0 }
  },

  // Jeux de Société
  {
    id: 1701,
    title: "Mon Premier Memory - Animaux",
    description: "Jeu de mémoire 3+, 36 cartes illustrées.",
    category: "Jeux de Société",
    type: "jeu",
    sizes: ["unité"],
    size: "unité",
    images: [
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800"
    ],
    stock: "70",
    price: 6900,
    prevprice: 7900,
    qty: 1,
    discount: 12.7,
    totalprice: 6900,
    rating: { rate: 0, count: 0 }
  },

  // Peluches & Doudous
  {
    id: 1801,
    title: "Doudou Lapin Ultra-Doux",
    description: "Peluches & doudous, lavable en machine, 0+.",
    category: "Peluches & Doudous",
    type: "peluche",
    sizes: ["S", "M", "L"],
    size: "M",
    images: [
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800"
    ],
    stock: "150",
    price: 9900,
    prevprice: 12900,
    qty: 1,
    discount: 23.3,
    totalprice: 9900,
    rating: { rate: 0, count: 0 }
  },
  {
    id: 1802,
    title: "Ours en Peluche Classique",
    description: "Grand ours en peluche, rembourrage moelleux, 3+.",
    category: "Peluches & Doudous",
    type: "peluche",
    sizes: ["M", "L"],
    size: "L",
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800"
    ],
    stock: "35",
    price: 19900,
    prevprice: 23900,
    qty: 1,
    discount: 16.7,
    totalprice: 19900,
    rating: { rate: 0, count: 0 }
  }
];