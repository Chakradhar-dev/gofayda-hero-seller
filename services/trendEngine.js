const STOP_WORDS = new Set([
  'with', 'and', 'the', 'for', 'in', 'of', 'to', 'a', 'an', 'is', 'by', 'on', 'at', 'from',
  'upto', 'up', 'all', 'new', 'latest', 'pack', 'set', 'edition', 'series', 'gen', 'version',
  'black', 'white', 'blue', 'grey', 'color', 'colour', 'piece', 'pcs', 'combo'
]);

const TECH_SPECS = [
  'AMOLED', 'Super AMOLED', 'OLED', '120Hz', '144Hz', '165Hz', '4K Ultra HD', 'Dolby Vision',
  'Active Noise Cancellation', 'ANC', 'AI-ENC', 'ENC', 'Spatial Audio', 'Dolby Atmos', 'Hi-Res Audio',
  'Fast Charging', 'SuperVOOC', '65W', '67W', '80W', '100W', '120W', '5000mAh', '6000mAh',
  'Wireless Charging', 'Bluetooth 5.3', 'Bluetooth 5.4', 'Dual Band', 'WiFi 6', '5G Supported',
  'IP68 Water Resistant', 'IP67', 'IPX5', 'IPX4', 'Stainless Steel', 'Titanium Frame', 'Military Grade',
  'Snapdragon', 'Dimensity', 'Apple Silicon M2', 'Apple Silicon M3', 'Intel Core i7', 'Ryzen 7',
  'BPS Calling', 'Built-in GPS', 'Dual GPS', 'Heart Rate & SpO2', 'Auto Shut-off', 'Touch Control'
];

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'OnePlus', 'boAt', 'Noise', 'Boult', 'Realme', 'Xiaomi', 'Redmi',
  'Poco', 'Motorola', 'Fire-Boltt', 'Fastrack', 'Asus', 'Lenovo', 'HP', 'Dell', 'Acer', 'Philips',
  'Prestige', 'Pigeon', 'Kent', 'Eureka Forbes', 'Nike', 'Puma', 'Adidas', 'Titan', 'Casio', 'Cosmic Byte'
];

function calculateTrendingScore(product) {
  const rank = product.rank || 10;
  const rating = product.rating || 4.0;
  const reviewCount = product.reviewCount || 1000;
  const discountPercent = product.discountPercent || 20;

  // Rank score: 1 to 20 -> 100 down to 40
  const rankScore = Math.max(30, 100 - (rank - 1) * 3.5);

  // Rating score: 3.5 to 5.0 -> 50 to 100
  const ratingScore = Math.max(40, ((rating - 3.0) / 2.0) * 100);

  // Review velocity score: logarithmic review volume
  const reviewScore = Math.min(100, Math.max(30, Math.log10(reviewCount + 10) * 23));

  // Discount boost: 10% to 75% -> 40 to 100
  const discountScore = Math.min(100, Math.max(35, discountPercent * 1.35));

  // Platform badge bonus
  let bonus = 0;
  if (product.badge && (product.badge.includes('Best Seller') || product.badge.includes('Choice') || product.badge.includes('Assured'))) {
    bonus = 5;
  }

  const rawScore = 0.35 * rankScore + 0.25 * reviewScore + 0.20 * ratingScore + 0.20 * discountScore + bonus;
  return Math.min(99, Math.max(45, Math.round(rawScore)));
}

function getVelocityBadge(score) {
  if (score >= 92) return { text: 'Breakout Trend', icon: '🚀', color: 'emerald' };
  if (score >= 84) return { text: 'Viral Demand', icon: '🔥', color: 'amber' };
  if (score >= 74) return { text: 'High Velocity', icon: '⚡', color: 'indigo' };
  return { text: 'Steady Seller', icon: '📈', color: 'blue' };
}

function extractKeywords(title) {
  if (!title) return [];
  const foundTags = new Set();

  // 1. Check known technical specs
  const titleLower = title.toLowerCase();
  for (const spec of TECH_SPECS) {
    if (titleLower.includes(spec.toLowerCase())) {
      foundTags.add(spec);
    }
  }

  // 2. Check brands
  for (const brand of BRANDS) {
    const regex = new RegExp(`\\b${brand}\\b`, 'i');
    if (regex.test(title)) {
      foundTags.add(brand);
    }
  }

  // 3. Extract meaningful tokens from title
  const words = title
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));

  // Add the first 2-3 distinctive words if tags count is low
  for (const word of words) {
    if (foundTags.size >= 5) break;
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    if (!foundTags.has(capitalized)) {
      foundTags.add(capitalized);
    }
  }

  return Array.from(foundTags).slice(0, 6);
}

function aggregateKeywordCloud(products) {
  const frequencyMap = {};
  for (const product of products) {
    if (Array.isArray(product.keywords)) {
      for (const kw of product.keywords) {
        frequencyMap[kw] = (frequencyMap[kw] || 0) + 1;
      }
    }
  }

  return Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([keyword, count]) => ({ keyword, count }));
}

function enrichProducts(products) {
  return products.map((product, index) => {
    const trendingScore = calculateTrendingScore(product);
    const velocity = getVelocityBadge(trendingScore);
    const keywords = extractKeywords(product.title);

    const estimatedWholesalePrice = Math.max(80, Math.round(product.price * 0.35));
    const wholesaleMarginPercent = Math.round(((product.price - estimatedWholesalePrice) / product.price) * 100);
    const searchNiche = (product.keywords && product.keywords[0]) || product.title.split(' ').slice(0, 2).join(' ');

    return {
      ...product,
      trendingScore,
      velocity,
      keywords,
      estimatedWholesalePrice,
      formattedWholesalePrice: `₹${estimatedWholesalePrice.toLocaleString('en-IN')}`,
      wholesaleMarginPercent,
      indiamartSearchUrl: `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(searchNiche)}`,
      rankChange: index === 0 ? '+3' : index === 1 ? '+5' : index % 2 === 0 ? '+2' : '-1',
      formattedPrice: `₹${product.price.toLocaleString('en-IN')}`,
      formattedOriginalPrice: `₹${product.originalPrice.toLocaleString('en-IN')}`,
      savingsAmount: `₹${(product.originalPrice - product.price).toLocaleString('en-IN')}`
    };
  });
}

module.exports = {
  calculateTrendingScore,
  getVelocityBadge,
  extractKeywords,
  aggregateKeywordCloud,
  enrichProducts
};
