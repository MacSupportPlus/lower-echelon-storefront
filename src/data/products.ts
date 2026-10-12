// Snapshot of the WooCommerce catalog, pulled from the public Store API on 2026-09-20.
// Slugs match the live WooCommerce URLs (/product/<slug>) so old links keep working after cutover.
// Stage 2 replaces this file with Postgres via the same Product shape. Images live in /public/products/<slug>/.

export type Category =
  | "Hoodies"
  | "Track suit"
  | "Sweatsuit"
  | "Shirts"
  | "Jersey"
  | "Shorts"
  | "Basketball"
  | "Socks";

export type Product = {
  slug: string;
  name: string;
  price: number; // USD
  category: Category;
  soldOut: boolean;
  sizes: string[];
  colors: string[];
  images: string[];
  details: string[];
};

export const products: Product[] = [
  {
    "slug": "lower-echelon-og-hoodie",
    "name": "Lower Echelon OG Hoodie",
    "price": 150,
    "category": "Hoodies",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Ivy",
      "Black",
      "Navy Blue"
    ],
    "images": [
      "/products/lower-echelon-og-hoodie/1.jpg",
      "/products/lower-echelon-og-hoodie/2.jpg",
      "/products/lower-echelon-og-hoodie/3.jpg",
      "/products/lower-echelon-og-hoodie/4.jpg",
      "/products/lower-echelon-og-hoodie/5.jpg",
      "/products/lower-echelon-og-hoodie/6.jpg"
    ],
    "details": []
  },
  {
    "slug": "run-it-up-tracksuit",
    "name": "Run It Up Tracksuit",
    "price": 185,
    "category": "Track suit",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy / White",
      "Grey / Black",
      "Black / White",
      "Green / White"
    ],
    "images": [
      "/products/run-it-up-tracksuit/1.jpg",
      "/products/run-it-up-tracksuit/2.jpg",
      "/products/run-it-up-tracksuit/3.jpg",
      "/products/run-it-up-tracksuit/4.jpg",
      "/products/run-it-up-tracksuit/5.jpg",
      "/products/run-it-up-tracksuit/6.jpg",
      "/products/run-it-up-tracksuit/7.jpg"
    ],
    "details": [
      "Fuck a runner",
      "Run it up",
      "Fuck a worker",
      "Be a Boss"
    ]
  },
  {
    "slug": "day-n-night-sweatsuit",
    "name": "Day n Night Sweatsuit",
    "price": 175,
    "category": "Sweatsuit",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gum Green",
      "White"
    ],
    "images": [
      "/products/day-n-night-sweatsuit/1.jpg",
      "/products/day-n-night-sweatsuit/2.jpg",
      "/products/day-n-night-sweatsuit/3.jpg",
      "/products/day-n-night-sweatsuit/4.jpg",
      "/products/day-n-night-sweatsuit/5.jpg",
      "/products/day-n-night-sweatsuit/6.jpg"
    ],
    "details": [
      "Airport Hours",
      "Sunday-Sunday"
    ]
  },
  {
    "slug": "lower-echelon-t-shirt",
    "name": "Lower Echelon OG TEE",
    "price": 65,
    "category": "Shirts",
    "soldOut": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black / White",
      "White / Black",
      "White / Navy",
      "Grey / Yellow"
    ],
    "images": [
      "/products/lower-echelon-t-shirt/1.jpg",
      "/products/lower-echelon-t-shirt/2.jpg",
      "/products/lower-echelon-t-shirt/3.jpg",
      "/products/lower-echelon-t-shirt/4.jpg",
      "/products/lower-echelon-t-shirt/5.jpg"
    ],
    "details": [
      "WHEN THEY PRESS YOU",
      "ASKING WHERE YOU FROM",
      "SHOW THEM YOUR TEE"
    ]
  },
  {
    "slug": "lower-echelon-jersey",
    "name": "Lower Echelon Field Jersey",
    "price": 90,
    "category": "Jersey",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black / White",
      "Green / White",
      "Navy / White",
      "Royal Blue"
    ],
    "images": [
      "/products/lower-echelon-jersey/1.jpg",
      "/products/lower-echelon-jersey/2.jpg",
      "/products/lower-echelon-jersey/3.jpg",
      "/products/lower-echelon-jersey/4.jpg"
    ],
    "details": [
      "When You In The Field",
      "And You Innocent",
      "Why You Over Here"
    ]
  },
  {
    "slug": "lower-echelon-kit",
    "name": "Lower Echelon Kit",
    "price": 90,
    "category": "Jersey",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [],
    "images": [
      "/products/lower-echelon-kit/1.jpg",
      "/products/lower-echelon-kit/2.jpg",
      "/products/lower-echelon-kit/3.jpg"
    ],
    "details": [
      "Lower Echelon Kit"
    ]
  },
  {
    "slug": "lower-echelon-housing-authority-box-tee",
    "name": "Lower Echelon Housing Authority box tee",
    "price": 55,
    "category": "Shirts",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black / White",
      "Navy / Yellow"
    ],
    "images": [
      "/products/lower-echelon-housing-authority-box-tee/1.jpg",
      "/products/lower-echelon-housing-authority-box-tee/2.jpg",
      "/products/lower-echelon-housing-authority-box-tee/3.jpg",
      "/products/lower-echelon-housing-authority-box-tee/4.jpg"
    ],
    "details": [
      "Housing Authority",
      "Box cut",
      "Heavy Weight",
      "Fitted Box Tee",
      "True to size"
    ]
  },
  {
    "slug": "lower-echelon-housing-authority-tee",
    "name": "Lower Echelon Housing Authority Tee",
    "price": 50,
    "category": "Shirts",
    "soldOut": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black / White",
      "White / Black"
    ],
    "images": [
      "/products/lower-echelon-housing-authority-tee/1.jpg",
      "/products/lower-echelon-housing-authority-tee/2.jpg",
      "/products/lower-echelon-housing-authority-tee/3.jpg",
      "/products/lower-echelon-housing-authority-tee/4.jpg",
      "/products/lower-echelon-housing-authority-tee/5.jpg",
      "/products/lower-echelon-housing-authority-tee/6.jpg"
    ],
    "details": [
      "YA FACE CARD NOT VALID",
      "THIS TEE IS",
      "YOURE WELCOME, STAY DANGEROUS"
    ]
  },
  {
    "slug": "basic-logo-tee",
    "name": "Basic Logo Tee",
    "price": 48,
    "category": "Shirts",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black",
      "Green",
      "Powder Blue"
    ],
    "images": [
      "/products/basic-logo-tee/1.jpg",
      "/products/basic-logo-tee/2.jpg",
      "/products/basic-logo-tee/3.jpg",
      "/products/basic-logo-tee/4.jpg",
      "/products/basic-logo-tee/5.jpg",
      "/products/basic-logo-tee/6.jpg"
    ],
    "details": []
  },
  {
    "slug": "lower-echelon-rib-tee",
    "name": "Lower Echelon Rib Tee",
    "price": 40,
    "category": "Shirts",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black / Grey",
      "Black / White",
      "Grey / Green",
      "White / Black"
    ],
    "images": [
      "/products/lower-echelon-rib-tee/1.jpg",
      "/products/lower-echelon-rib-tee/2.jpg",
      "/products/lower-echelon-rib-tee/3.jpg",
      "/products/lower-echelon-rib-tee/4.jpg",
      "/products/lower-echelon-rib-tee/5.jpg"
    ],
    "details": [
      "Rib tee",
      "Projects on the side",
      "Projects by my side"
    ]
  },
  {
    "slug": "lower-echelon-collegiate-tee",
    "name": "Lower Echelon Collegiate Tee",
    "price": 40,
    "category": "Shirts",
    "soldOut": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Grey / Navy",
      "Navy / Yellow",
      "White / Royal"
    ],
    "images": [
      "/products/lower-echelon-collegiate-tee/1.jpg"
    ],
    "details": [
      "Aint tuition for having no ambition",
      "And aint no loans for sitting yo ass at home"
    ]
  },
  {
    "slug": "le-project-polo",
    "name": "LE Project Polo",
    "price": 80,
    "category": "Shirts",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [],
    "images": [
      "/products/le-project-polo/1.jpg",
      "/products/le-project-polo/2.jpg",
      "/products/le-project-polo/3.jpg"
    ],
    "details": [
      "Waffle Knitted",
      "Oversized",
      "Project Polo"
    ]
  },
  {
    "slug": "lower-echelon-mesh-shorts",
    "name": "Lower Echelon Mesh Shorts",
    "price": 65,
    "category": "Shorts",
    "soldOut": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green / White",
      "White / Black"
    ],
    "images": [
      "/products/lower-echelon-mesh-shorts/1.jpg",
      "/products/lower-echelon-mesh-shorts/2.jpg"
    ],
    "details": []
  },
  {
    "slug": "le-pass-the-roc",
    "name": "LE Pass the Roc",
    "price": 110,
    "category": "Basketball",
    "soldOut": false,
    "sizes": [
      "One size"
    ],
    "colors": [],
    "images": [
      "/products/le-pass-the-roc/1.jpg",
      "/products/le-pass-the-roc/2.jpg"
    ],
    "details": [
      "Never tryna hold the ball",
      "I\u2019m cool with the assist",
      "Just hope bruh don\u2019t miss"
    ]
  },
  {
    "slug": "lower-socks",
    "name": "Lower Echelon 3-pack Sock",
    "price": 45,
    "category": "Socks",
    "soldOut": false,
    "sizes": [
      "One size"
    ],
    "colors": [],
    "images": [
      "/products/lower-socks/1.jpg"
    ],
    "details": []
  }
];
