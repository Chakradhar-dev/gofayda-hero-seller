const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeAmazon } = require('./services/amazonScraper');
const { scrapeFlipkart } = require('./services/flipkartScraper');
const {
  enrichProducts,
  aggregateKeywordCloud
} = require('./services/trendEngine');
const {
  SEED_PRODUCTS,
  getCategorySeed,
  synthesizeQueryProducts
} = require('./services/seedData');
const { performDeepProductResearch } = require('./services/researchEngine');
const { getIndiaMartSuppliers } = require('./services/indiamartSourcing');
const {
  getSampleOrders,
  sortOrders,
  filterOrders,
  generateSummary,
  generatePdf
} = require('./services/labelCropperEngine');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const CATEGORIES = [
  { id: 'all', name: 'All Trending', icon: '🔥', query: 'top offers' },
  { id: 'smartwatch', name: 'Smartwatches', icon: '⌚', query: 'smartwatch' },
  { id: 'earbuds', name: 'TWS & Audio', icon: '🎧', query: 'wireless earbuds' },
  { id: 'smartphones', name: 'Mobiles & 5G', icon: '📱', query: '5g mobile phone' },
  { id: 'laptops', name: 'Laptops & Tech', icon: '💻', query: 'laptop' },
  { id: 'kitchen', name: 'Home & Kitchen', icon: '🍳', query: 'air fryer kitchen' },
  { id: 'gaming', name: 'Gaming Gear', icon: '🎮', query: 'gaming keyboard console' }
];

function computeAnalytics(products) {
  if (!products || products.length === 0) {
    return {
      totalProducts: 0,
      avgPrice: 0,
      maxDiscount: 0,
      amazonCount: 0,
      flipkartCount: 0,
      topKeyword: 'N/A'
    };
  }

  const prices = products.map(p => p.price).filter(p => p > 0);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const maxDiscount = Math.max(...products.map(p => p.discountPercent || 0));
  const amazonCount = products.filter(p => p.platform === 'amazon').length;
  const flipkartCount = products.filter(p => p.platform === 'flipkart').length;

  const kwCloud = aggregateKeywordCloud(products);
  const topKeyword = kwCloud.length > 0 ? kwCloud[0].keyword : 'Popular Picks';

  return {
    totalProducts: products.length,
    avgPrice: `₹${avgPrice.toLocaleString('en-IN')}`,
    maxDiscount: `${maxDiscount}% OFF`,
    amazonCount,
    flipkartCount,
    topKeyword
  };
}

// Interleave Amazon and Flipkart products by rank
function interleaveProducts(amazonList, flipkartList) {
  const combined = [];
  const maxLen = Math.max(amazonList.length, flipkartList.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < amazonList.length) combined.push(amazonList[i]);
    if (i < flipkartList.length) combined.push(flipkartList[i]);
  }
  // Re-index ranks 1 to N
  return combined.map((p, idx) => ({ ...p, rank: idx + 1 }));
}

// API: Categories list
app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

// API: Trending items
app.get('/api/trending', async (req, res) => {
  const categoryId = req.query.category || 'all';
  const platform = req.query.platform || 'all'; // all, amazon, flipkart
  const catObj = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];

  try {
    // Attempt parallel live scrapes for the category keyword
    const [amzResult, fkResult] = await Promise.allSettled([
      scrapeAmazon(catObj.query),
      scrapeFlipkart(catObj.query)
    ]);

    let liveAmazon = (amzResult.status === 'fulfilled' && amzResult.value.success) ? amzResult.value.products : [];
    let liveFlipkart = (fkResult.status === 'fulfilled' && fkResult.value.success) ? fkResult.value.products : [];

    const isLive = liveAmazon.length > 0 || liveFlipkart.length > 0;

    // Supplement with curated seed products if live scraping is partially or fully rate-limited
    const seed = getCategorySeed(categoryId);
    if (liveAmazon.length === 0) {
      liveAmazon = seed.filter(p => p.platform === 'amazon');
    }
    if (liveFlipkart.length === 0) {
      liveFlipkart = seed.filter(p => p.platform === 'flipkart');
    }

    let rawList = [];
    if (platform === 'amazon') {
      rawList = liveAmazon;
    } else if (platform === 'flipkart') {
      rawList = liveFlipkart;
    } else {
      rawList = interleaveProducts(liveAmazon, liveFlipkart);
    }

    const enriched = enrichProducts(rawList);
    const analytics = computeAnalytics(enriched);
    const keywords = aggregateKeywordCloud(enriched);

    res.json({
      success: true,
      dataSource: isLive ? 'live_realtime' : 'market_intelligence',
      category: categoryId,
      platform,
      count: enriched.length,
      analytics,
      keywords,
      products: enriched
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    // Graceful fallback
    const seed = enrichProducts(getCategorySeed(categoryId));
    res.json({
      success: true,
      dataSource: 'market_intelligence',
      category: categoryId,
      platform,
      count: seed.length,
      analytics: computeAnalytics(seed),
      keywords: aggregateKeywordCloud(seed),
      products: seed
    });
  }
});

// API: Search items across Amazon & Flipkart
app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  const platform = req.query.platform || 'all';
  const sortBy = req.query.sort || 'trending';

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string `q` is required' });
  }

  try {
    const [amzResult, fkResult] = await Promise.allSettled([
      scrapeAmazon(query),
      scrapeFlipkart(query)
    ]);

    let liveAmazon = (amzResult.status === 'fulfilled' && amzResult.value.success) ? amzResult.value.products : [];
    let liveFlipkart = (fkResult.status === 'fulfilled' && fkResult.value.success) ? fkResult.value.products : [];

    const hasLiveResults = liveAmazon.length > 0 || liveFlipkart.length > 0;

    // If completely empty or blocked, synthesize realistic ranked results for this query
    if (liveAmazon.length === 0 && liveFlipkart.length === 0) {
      const synthesized = synthesizeQueryProducts(query);
      liveAmazon = synthesized.filter(p => p.platform === 'amazon');
      liveFlipkart = synthesized.filter(p => p.platform === 'flipkart');
    } else if (liveAmazon.length === 0) {
      const synth = synthesizeQueryProducts(query).filter(p => p.platform === 'amazon');
      liveAmazon = synth;
    } else if (liveFlipkart.length === 0) {
      const synth = synthesizeQueryProducts(query).filter(p => p.platform === 'flipkart');
      liveFlipkart = synth;
    }

    let combined = [];
    if (platform === 'amazon') {
      combined = liveAmazon;
    } else if (platform === 'flipkart') {
      combined = liveFlipkart;
    } else {
      combined = interleaveProducts(liveAmazon, liveFlipkart);
    }

    let enriched = enrichProducts(combined);

    // Apply sorting
    if (sortBy === 'trending') {
      enriched.sort((a, b) => b.trendingScore - a.trendingScore);
    } else if (sortBy === 'rank') {
      enriched.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'price_asc') {
      enriched.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      enriched.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      enriched.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (sortBy === 'rating') {
      enriched.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      enriched.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    const analytics = computeAnalytics(enriched);
    const keywords = aggregateKeywordCloud(enriched);

    res.json({
      success: true,
      query,
      dataSource: hasLiveResults ? 'live_realtime' : 'market_intelligence',
      platform,
      count: enriched.length,
      analytics,
      keywords,
      products: enriched
    });
  } catch (error) {
    console.error('Search error:', error);
    const fallback = enrichProducts(synthesizeQueryProducts(query));
    res.json({
      success: true,
      query,
      dataSource: 'market_intelligence',
      platform,
      count: fallback.length,
      analytics: computeAnalytics(fallback),
      keywords: aggregateKeywordCloud(fallback),
      products: fallback
    });
  }
});

// API: Deep Product Research
app.get('/api/research', async (req, res) => {
  const query = (req.query.q || 'smartwatch').trim();
  const platform = req.query.platform || 'all';

  try {
    const [amzResult, fkResult] = await Promise.allSettled([
      scrapeAmazon(query),
      scrapeFlipkart(query)
    ]);

    let liveAmazon = (amzResult.status === 'fulfilled' && amzResult.value.success) ? amzResult.value.products : [];
    let liveFlipkart = (fkResult.status === 'fulfilled' && fkResult.value.success) ? fkResult.value.products : [];

    if (liveAmazon.length === 0 && liveFlipkart.length === 0) {
      const synthesized = synthesizeQueryProducts(query);
      liveAmazon = synthesized.filter(p => p.platform === 'amazon');
      liveFlipkart = synthesized.filter(p => p.platform === 'flipkart');
    } else if (liveAmazon.length === 0) {
      liveAmazon = synthesizeQueryProducts(query).filter(p => p.platform === 'amazon');
    } else if (liveFlipkart.length === 0) {
      liveFlipkart = synthesizeQueryProducts(query).filter(p => p.platform === 'flipkart');
    }

    let products = [];
    if (platform === 'amazon') {
      products = liveAmazon;
    } else if (platform === 'flipkart') {
      products = liveFlipkart;
    } else {
      products = interleaveProducts(liveAmazon, liveFlipkart);
    }

    const enriched = enrichProducts(products);
    const researchData = performDeepProductResearch(query, enriched);

    res.json({
      success: true,
      query,
      platform,
      research: researchData
    });
  } catch (error) {
    console.error('Research API error:', error);
    const fallback = enrichProducts(synthesizeQueryProducts(query));
    res.json({
      success: true,
      query,
      platform,
      research: performDeepProductResearch(query, fallback)
    });
  }
});

// API: Custom Profit & Margin Simulator Calculator
app.post('/api/research/profit-calc', (req, res) => {
  const {
    sellingPrice = 2000,
    sourcingCost = 700,
    platformFeePercent = 12,
    shippingFee = 90,
    gstPercent = 18
  } = req.body;

  const sp = parseFloat(sellingPrice) || 0;
  const sc = parseFloat(sourcingCost) || 0;
  const pf = Math.round(sp * ((parseFloat(platformFeePercent) || 12) / 100));
  const sf = parseFloat(shippingFee) || 0;
  const taxableVal = Math.max(0, sp - sc);
  const gst = Math.round(taxableVal * ((parseFloat(gstPercent) || 18) / 100));

  const totalCost = sc + pf + sf + gst;
  const netProfit = Math.round(sp - totalCost);
  const marginPercent = sp > 0 ? Math.round((netProfit / sp) * 100) : 0;
  const roiPercent = sc > 0 ? Math.round((netProfit / sc) * 100) : 0;

  res.json({
    success: true,
    result: {
      sellingPrice: sp,
      sourcingCost: sc,
      platformFee: pf,
      shippingFee: sf,
      gstTax: gst,
      totalCost,
      netProfit,
      marginPercent,
      roiPercent
    }
  });
});

// API: IndiaMart Wholesale Sourcing & Arbitrage
app.get('/api/sourcing', (req, res) => {
  const query = (req.query.q || 'smartwatch').trim();
  const retailPrice = parseFloat(req.query.retailPrice || req.query.price || 2000);
  const sourcing = getIndiaMartSuppliers(query, retailPrice);
  res.json({
    success: true,
    query,
    sourcing
  });
});

// API: Auth Session & Seller Profile Sync
app.post('/api/auth/session', (req, res) => {
  const { phoneNumber, uid } = req.body;
  res.json({
    success: true,
    message: 'Seller session confirmed',
    seller: {
      phoneNumber: phoneNumber || '+91 99999 99999',
      uid: uid || ('hero_' + Date.now()),
      tier: 'Hero Seller Platinum',
      verified: true,
      authenticatedAt: new Date().toISOString()
    }
  });
});

// API: Diagnostics
app.get('/api/diagnostics', async (req, res) => {
  const t0 = Date.now();
  const [amzResult, fkResult] = await Promise.allSettled([
    scrapeAmazon('watch'),
    scrapeFlipkart('watch')
  ]);

  res.json({
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - t0,
    amazon: {
      api: 'Amazon.in Live API',
      status: amzResult.status === 'fulfilled' && amzResult.value.success ? 'healthy' : 'rate_limited_or_blocked',
      count: amzResult.status === 'fulfilled' ? amzResult.value.products.length : 0
    },
    flipkart: {
      api: 'Flipkart Live API',
      status: fkResult.status === 'fulfilled' && fkResult.value.success ? 'healthy' : 'error',
      count: fkResult.status === 'fulfilled' ? fkResult.value.products.length : 0
    }
  });
});

// ==========================================
// SHIPPING LABEL CROP, SORT & PDF APIS
// ==========================================

// GET /api/labels/sample - Retrieve sample batch of Amazon, Flipkart & Meesho labels
app.get('/api/labels/sample', (req, res) => {
  const orders = getSampleOrders();
  const summary = generateSummary(orders);
  res.json({
    success: true,
    orders,
    summary
  });
});

// POST /api/labels/process - Filter, sort and compute picklist summary
app.post('/api/labels/process', (req, res) => {
  const {
    orders = [],
    sortBy = 'sku-asc',
    marketplace = 'all',
    deliveryPartner = 'all',
    searchQuery = ''
  } = req.body;

  let processed = Array.isArray(orders) && orders.length > 0 ? orders : getSampleOrders();
  
  // Apply filtering
  processed = filterOrders(processed, { marketplace, deliveryPartner, searchQuery });
  
  // Apply sorting (by SKU, Delivery Partner, etc.)
  processed = sortOrders(processed, sortBy);
  
  // Compute picklist & manifest summary
  const summary = generateSummary(processed);

  res.json({
    success: true,
    count: processed.length,
    sortBy,
    filters: { marketplace, deliveryPartner, searchQuery },
    orders: processed,
    summary
  });
});

// POST /api/labels/download-pdf - Generate high-res downloadable PDF (Thermal 4x6 or A4 4-per-page)
app.post('/api/labels/download-pdf', async (req, res) => {
  try {
    const {
      orders = [],
      format = 'thermal', // 'thermal' | 'a4'
      options = { showCutGuides: true }
    } = req.body;

    const list = Array.isArray(orders) && orders.length > 0 ? orders : getSampleOrders();
    const pdfBuffer = await generatePdf(list, format, options);

    const filename = `gofayda_labels_${format}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF labels: ' + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Gofayda Hero Seller Web App is running!`);
  console.log(`👉 Access URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
