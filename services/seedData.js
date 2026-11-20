const SEED_PRODUCTS = [
  // Smartwatches
  {
    id: 'amz-sw-01',
    asin: 'B0C77J1FGR',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'Noise ColorFit Pulse 3 with 1.96" TFT Display, Bluetooth Calling, 550 Nits, 100 Sports Modes (Jet Black)',
    price: 1399,
    originalPrice: 4999,
    discountPercent: 72,
    rating: 4.3,
    reviewCount: 42180,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0C77J1FGR?tag=gofayda-21',
    badge: '#1 Best Seller in Smartwatches',
    category: 'smartwatch'
  },
  {
    id: 'fk-sw-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'Fire-Boltt Gladiator 1.96" AMOLED Bluetooth Calling Smartwatch with AI Voice Assistant (Dark Grey)',
    price: 1599,
    originalPrice: 6999,
    discountPercent: 77,
    rating: 4.4,
    reviewCount: 58920,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/fire-boltt-gladiator-smartwatch/p/itm12345?affid=gofayda',
    badge: 'Flipkart Assured',
    category: 'smartwatch'
  },
  {
    id: 'amz-sw-03',
    asin: 'B0C8V4F37Y',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 3,
    title: 'boAt Wave Call 2 with 1.83" HD Display, Advanced BT Calling, DIY Watch Face Studio, HR & SpO2',
    price: 1299,
    originalPrice: 4499,
    discountPercent: 71,
    rating: 4.2,
    reviewCount: 36710,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0C8V4F37Y?tag=gofayda-21',
    badge: "Amazon's Choice",
    category: 'smartwatch'
  },
  {
    id: 'fk-sw-04',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 4,
    title: 'Fastrack Limitless FS1 Pro 1.96" Super AMOLED Curved Display, SingleSync BT Calling',
    price: 2499,
    originalPrice: 7995,
    discountPercent: 68,
    rating: 4.3,
    reviewCount: 22400,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/fastrack-limitless-fs1-pro-smartwatch/p/itm67890?affid=gofayda',
    badge: 'Top Trending Deal',
    category: 'smartwatch'
  },
  {
    id: 'amz-sw-05',
    asin: 'B0BY8R29PB',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 5,
    title: 'Samsung Galaxy Watch6 Bluetooth (40mm, Graphite) with Body Composition Analysis, Sleep Tracker',
    price: 18999,
    originalPrice: 33999,
    discountPercent: 44,
    rating: 4.5,
    reviewCount: 6810,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0BY8R29PB?tag=gofayda-21',
    badge: 'Flagship Bestseller',
    category: 'smartwatch'
  },

  // Audio & TWS Earbuds
  {
    id: 'amz-ear-01',
    asin: 'B09N3ZNHTY',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds with 42H Playtime, Beast Mode, ENx Tech',
    price: 999,
    originalPrice: 4490,
    discountPercent: 78,
    rating: 4.2,
    reviewCount: 198400,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B09N3ZNHTY?tag=gofayda-21',
    badge: '#1 Best Seller in Earphones',
    category: 'earbuds'
  },
  {
    id: 'fk-ear-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'OnePlus Nord Buds 2 TWS Earbuds with Active Noise Cancellation (ANC), 12.4mm Drivers, 36H Playback',
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    rating: 4.5,
    reviewCount: 112000,
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/oneplus-nord-buds-2-tws/p/itm54321?affid=gofayda',
    badge: 'Flipkart Assured',
    category: 'earbuds'
  },
  {
    id: 'amz-ear-03',
    asin: 'B0C7JMGKLL',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 3,
    title: 'Realme Buds Air 5 with 50dB Active Noise Cancellation, 12.4mm Mega Titanizing Driver, 38H Playtime',
    price: 3199,
    originalPrice: 5999,
    discountPercent: 47,
    rating: 4.4,
    reviewCount: 24500,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0C7JMGKLL?tag=gofayda-21',
    badge: "Amazon's Choice",
    category: 'earbuds'
  },
  {
    id: 'fk-ear-04',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 4,
    title: 'Boult Audio Z40 with 60H Playtime, Zen ENC Mic, 10mm BoomX Drivers, Type-C Fast Charging (White)',
    price: 1199,
    originalPrice: 4999,
    discountPercent: 76,
    rating: 4.2,
    reviewCount: 94300,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/boult-audio-z40-earbuds/p/itm98765?affid=gofayda',
    badge: 'Top Trending Deal',
    category: 'earbuds'
  },
  {
    id: 'amz-ear-05',
    asin: 'B0C33XXS56',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 5,
    title: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds, Industry Best ANC, Dual Processors, Hi-Res Audio',
    price: 21990,
    originalPrice: 29990,
    discountPercent: 27,
    rating: 4.6,
    reviewCount: 8940,
    image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0C33XXS56?tag=gofayda-21',
    badge: 'Premium Flagship Audio',
    category: 'earbuds'
  },

  // Smartphones & Mobiles
  {
    id: 'amz-mob-01',
    asin: 'B0CHX1W1XY',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'Apple iPhone 15 (128 GB) - Black with Dynamic Island, 48MP Main Camera, USB-C Connectivity',
    price: 65999,
    originalPrice: 79900,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 28400,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0CHX1W1XY?tag=gofayda-21',
    badge: '#1 Best Seller in Smartphones',
    category: 'smartphones'
  },
  {
    id: 'fk-mob-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'Motorola Edge 50 Fusion (Marshmallow Blue, 128 GB) 144Hz Curved pOLED, Sony Lytia 700C Camera, 68W TurboPower',
    price: 22999,
    originalPrice: 25999,
    discountPercent: 12,
    rating: 4.5,
    reviewCount: 84300,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/motorola-edge-50-fusion/p/itm11223?affid=gofayda',
    badge: 'Flipkart Assured',
    category: 'smartphones'
  },
  {
    id: 'amz-mob-03',
    asin: 'B0CQYG5H3P',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 3,
    title: 'OnePlus 12R (Cool Blue, 8GB RAM, 128GB Storage) Snapdragon 8 Gen 2, 120Hz ProXDR Display, 100W SUPERVOOC',
    price: 37999,
    originalPrice: 39999,
    discountPercent: 5,
    rating: 4.5,
    reviewCount: 19800,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0CQYG5H3P?tag=gofayda-21',
    badge: "Amazon's Choice",
    category: 'smartphones'
  },
  {
    id: 'fk-mob-04',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 4,
    title: 'Realme 12 Pro+ 5G (Submarine Blue, 256 GB) Periscope Portrait OIS Camera, Luxury Watch Design',
    price: 27999,
    originalPrice: 34999,
    discountPercent: 20,
    rating: 4.4,
    reviewCount: 37400,
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/realme-12-pro-plus-5g/p/itm44556?affid=gofayda',
    badge: 'Top Selling 5G',
    category: 'smartphones'
  },
  {
    id: 'amz-mob-05',
    asin: 'B0CS21919C',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 5,
    title: 'Redmi Note 13 Pro 5G (Midnight Black, 8GB RAM, 128GB Storage) 200MP OIS Camera, 1.5K AMOLED 120Hz',
    price: 24999,
    originalPrice: 28999,
    discountPercent: 14,
    rating: 4.3,
    reviewCount: 15400,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0CS21919C?tag=gofayda-21',
    badge: 'High Velocity',
    category: 'smartphones'
  },

  // Laptops & Computing
  {
    id: 'amz-lap-01',
    asin: 'B0B3C58S5Q',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'Apple MacBook Air Laptop M2 chip: 13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard',
    price: 84990,
    originalPrice: 99900,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 5120,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0B3C58S5Q?tag=gofayda-21',
    badge: '#1 Best Seller in Laptops',
    category: 'laptops'
  },
  {
    id: 'fk-lap-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'ASUS TUF Gaming F15 Intel Core i5 11th Gen - (16 GB/512 GB SSD/RTX 2050/144 Hz) FX506HF-HN025W Gaming Laptop',
    price: 49990,
    originalPrice: 74990,
    discountPercent: 33,
    rating: 4.4,
    reviewCount: 14890,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/asus-tuf-gaming-f15/p/itm77889?affid=gofayda',
    badge: 'Flipkart Assured',
    category: 'laptops'
  },
  {
    id: 'amz-lap-03',
    asin: 'B0CW1F146S',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 3,
    title: 'Lenovo IdeaPad Slim 3 13th Gen Intel Core i5-13420H 15.6" FHD IPS (16GB RAM/512GB SSD/Win 11/Office 21/1.62Kg)',
    price: 52990,
    originalPrice: 79990,
    discountPercent: 34,
    rating: 4.3,
    reviewCount: 3420,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0CW1F146S?tag=gofayda-21',
    badge: "Amazon's Choice",
    category: 'laptops'
  },

  // Home & Kitchen
  {
    id: 'amz-kit-01',
    asin: 'B08F9G1Q3Q',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'Philips Digital Air Fryer HD9252/90 with Rapid Air Technology, 4.1 Liter, Touch Panel, 7 Pre-set Menus',
    price: 7499,
    originalPrice: 11995,
    discountPercent: 37,
    rating: 4.5,
    reviewCount: 31200,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B08F9G1Q3Q?tag=gofayda-21',
    badge: '#1 Best Seller in Kitchen Appliances',
    category: 'kitchen'
  },
  {
    id: 'fk-kit-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'Pigeon by Stovekraft Healthifry Digital Air Fryer 4.2 L with 360 Degree High Speed Air Circulation',
    price: 2699,
    originalPrice: 5995,
    discountPercent: 55,
    rating: 4.3,
    reviewCount: 45200,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/pigeon-healthifry-air-fryer/p/itm33445?affid=gofayda',
    badge: 'Flipkart Assured',
    category: 'kitchen'
  },

  // Gaming
  {
    id: 'amz-gam-01',
    asin: 'B0CY5Q2N1C',
    platform: 'amazon',
    platformName: 'Amazon.in',
    rank: 1,
    title: 'Sony PlayStation 5 Slim Console (PS5) with 1TB SSD Storage, DualSense Wireless Controller, 4K 120Hz HDR',
    price: 49990,
    originalPrice: 54990,
    discountPercent: 9,
    rating: 4.8,
    reviewCount: 12400,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.amazon.in/dp/B0CY5Q2N1C?tag=gofayda-21',
    badge: '#1 Best Seller in Video Games',
    category: 'gaming'
  },
  {
    id: 'fk-gam-02',
    platform: 'flipkart',
    platformName: 'Flipkart',
    rank: 2,
    title: 'Cosmic Byte CB-GK-16 Firefly RGB Tenkeyless Mechanical Keyboard with Outemu Blue Switches',
    price: 2199,
    originalPrice: 3499,
    discountPercent: 37,
    rating: 4.4,
    reviewCount: 18900,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.flipkart.com/cosmic-byte-mechanical-keyboard/p/itm88990?affid=gofayda',
    badge: 'Trending Gaming Accessory',
    category: 'gaming'
  }
];

function getCategorySeed(category) {
  if (!category || category === 'all') {
    return SEED_PRODUCTS;
  }
  const filtered = SEED_PRODUCTS.filter(p => p.category === category);
  return filtered.length > 0 ? filtered : SEED_PRODUCTS;
}

function synthesizeQueryProducts(query) {
  const qLower = query.toLowerCase();
  // Filter existing matching items first
  const matched = SEED_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(qLower) || 
    p.category.toLowerCase().includes(qLower)
  );

  if (matched.length >= 3) {
    return matched;
  }

  // Generate high-fidelity synthesized ranked items for novelty queries
  const capitalized = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const synth = [
    {
      id: `amz-synth-1`,
      platform: 'amazon',
      platformName: 'Amazon.in',
      rank: 1,
      title: `${capitalized} Pro Series - Ultra HD Edition with Fast Charging, Smart Sensors & App Sync`,
      price: 2999,
      originalPrice: 6999,
      discountPercent: 57,
      rating: 4.4,
      reviewCount: 18450,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      url: `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=gofayda-21`,
      badge: '#1 Best Seller in Category',
      category: 'general'
    },
    {
      id: `fk-synth-2`,
      platform: 'flipkart',
      platformName: 'Flipkart',
      rank: 2,
      title: `${capitalized} Plus Smart Edition with Heavy Duty Build, 1 Year Warranty & Free Delivery`,
      price: 2499,
      originalPrice: 5499,
      discountPercent: 55,
      rating: 4.3,
      reviewCount: 29300,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&affid=gofayda`,
      badge: 'Flipkart Assured',
      category: 'general'
    },
    {
      id: `amz-synth-3`,
      platform: 'amazon',
      platformName: 'Amazon.in',
      rank: 3,
      title: `${capitalized} Elite Max - Premium Metallic Finish, Dual Mode & Energy Saving Technology`,
      price: 4199,
      originalPrice: 8999,
      discountPercent: 53,
      rating: 4.5,
      reviewCount: 12890,
      image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=80',
      url: `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=gofayda-21`,
      badge: "Amazon's Choice",
      category: 'general'
    },
    {
      id: `fk-synth-4`,
      platform: 'flipkart',
      platformName: 'Flipkart',
      rank: 4,
      title: `${capitalized} Compact Travel Edition with Noise Reduction & Long Battery Backup`,
      price: 1899,
      originalPrice: 3999,
      discountPercent: 52,
      rating: 4.2,
      reviewCount: 8430,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&affid=gofayda`,
      badge: 'Top Trending Pick',
      category: 'general'
    }
  ];

  return [...matched, ...synth];
}

module.exports = {
  SEED_PRODUCTS,
  getCategorySeed,
  synthesizeQueryProducts
};
