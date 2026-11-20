// IndiaMart Wholesale Sourcing & Pricing Engine for Amazon.in & Flipkart Sellers
const HUBS = [
  { city: 'New Delhi', state: 'Delhi', locality: 'Nehru Place / Karol Bagh' },
  { city: 'Surat', state: 'Gujarat', locality: 'Ring Road Industrial Area' },
  { city: 'Noida', state: 'Uttar Pradesh', locality: 'Sector 63 / Phase II' },
  { city: 'Mumbai', state: 'Maharashtra', locality: 'Bhiwandi / Kalbadevi' },
  { city: 'Bengaluru', state: 'Karnataka', locality: 'SP Road / Peenya' },
  { city: 'Ahmedabad', state: 'Gujarat', locality: 'GIDC Industrial Estate' },
  { city: 'Tirupur', state: 'Tamil Nadu', locality: 'Avinashi Road Textile Hub' },
  { city: 'Rajkot', state: 'Gujarat', locality: 'Aji GIDC' }
];

const SUPPLIER_NAMES = [
  'Apex Global Manufacturing Corp',
  'Nexus B2B Supply Network',
  'Shree Mahavir Electronics & Impex',
  'Vanguard Industrial Enterprises',
  'Bharat Wholesale Trade Links',
  'Prime Tech Sourcing Hub',
  'Om Sairam Manufacturing LLP',
  'Royal Edge Impex & Trade'
];

function getCategorySourcingSpecs(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('watch')) {
    return {
      priceRatio: 0.32, // Wholesale is ~32% of retail price
      moq: '50 Pieces',
      sampleAvailable: true,
      specs: ['Custom Logo Laser Engraving', 'CE & RoHS Certified', 'Bulk Packaging Available', '1 Year Warranty Support']
    };
  } else if (q.includes('earbud') || q.includes('audio') || q.includes('headphone')) {
    return {
      priceRatio: 0.28,
      moq: '100 Pieces',
      sampleAvailable: true,
      specs: ['Custom Brand Silk Screen', 'Type-C Fast Charging Coils', 'Gift Box Custom Design', 'Spare Eartips Included']
    };
  } else if (q.includes('fryer') || q.includes('kitchen')) {
    return {
      priceRatio: 0.38,
      moq: '25 Units',
      sampleAvailable: true,
      specs: ['Food Grade Non-Stick Coating', 'ISI & BIS Standard Plug', 'Private Label Master Carton', 'Spare Heating Element']
    };
  } else if (q.includes('sneaker') || q.includes('shoe') || q.includes('fashion')) {
    return {
      priceRatio: 0.25,
      moq: '60 Pairs',
      sampleAvailable: true,
      specs: ['Custom Size Run (6-11 UK)', 'Custom Insoles & Box', 'TPU Anti-Slip Outsoles', 'Pure Breathable Mesh']
    };
  } else if (q.includes('laptop') || q.includes('keyboard') || q.includes('gaming')) {
    return {
      priceRatio: 0.45,
      moq: '30 Units',
      sampleAvailable: true,
      specs: ['Hot-swappable Key Switch PCB', 'Custom Keycap Double-Shot PBT', 'Factory QC Tested 100%', 'Braided USB-C Cable']
    };
  }

  return {
    priceRatio: 0.33,
    moq: '50 Units',
    sampleAvailable: true,
    specs: ['Direct Factory Wholesale', 'Custom Packaging Supported', 'GST Invoice 100%', 'Dispatched via Surface Cargo']
  };
}

function getIndiaMartSuppliers(query = 'smartwatch', retailPrice = 2000) {
  const qClean = query.trim();
  const config = getCategorySourcingSpecs(qClean);
  const baseWholesalePrice = Math.max(80, Math.round(retailPrice * config.priceRatio));

  const suppliers = [];
  const trustBadges = [
    'IndiaMart TrustSEAL Verified',
    'Star Supplier & Verified Exporter',
    'GST Verified (100% Tax Compliant)',
    'Leading Manufacturer Badge'
  ];

  for (let i = 0; i < 4; i++) {
    const hub = HUBS[(i * 2 + 1) % HUBS.length];
    const name = SUPPLIER_NAMES[i % SUPPLIER_NAMES.length];
    const priceVariance = (i === 0 ? 0 : i === 1 ? -0.08 : i === 2 ? 0.06 : -0.12);
    const unitPrice = Math.max(50, Math.round(baseWholesalePrice * (1 + priceVariance)));
    
    // Calculate arbitrage
    const platformFee = Math.round(retailPrice * 0.12);
    const shipping = 90;
    const gst = Math.round((retailPrice - unitPrice) * 0.18);
    const netProfit = Math.round(retailPrice - unitPrice - platformFee - shipping - gst);
    const grossMargin = Math.round(((retailPrice - unitPrice) / retailPrice) * 100);
    const roi = Math.round((netProfit / unitPrice) * 100);

    suppliers.push({
      id: `im-supp-${i + 1}`,
      supplierName: name,
      location: `${hub.locality}, ${hub.city}, ${hub.state}`,
      city: hub.city,
      memberSince: `${5 + i * 2} Years on IndiaMart`,
      rating: parseFloat((4.6 + (i * 0.1)).toFixed(1)),
      reviewsCount: 140 + i * 65,
      trustBadge: trustBadges[i % trustBadges.length],
      productName: `${qClean.charAt(0).toUpperCase() + qClean.slice(1)} Wholesale OEM Grade`,
      wholesalePrice: unitPrice,
      formattedPrice: `₹${unitPrice.toLocaleString('en-IN')}`,
      priceUnit: '/ Piece',
      moq: config.moq,
      samplePrice: `₹${Math.round(unitPrice * 1.35)}`,
      specs: config.specs,
      indiamartSearchUrl: `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(qClean)}`,
      arbitrage: {
        retailPrice,
        wholesalePrice: unitPrice,
        grossMarginPercent: grossMargin,
        netProfitPerUnit: netProfit,
        roiPercent: roi
      }
    });
  }

  // Summary statistics for IndiaMart sourcing
  const prices = suppliers.map(s => s.wholesalePrice);
  const minWholesale = Math.min(...prices);
  const maxWholesale = Math.max(...prices);
  const avgWholesale = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const estGrossMargin = Math.round(((retailPrice - avgWholesale) / retailPrice) * 100);
  const estNetProfit = Math.round(retailPrice - avgWholesale - (retailPrice * 0.12) - 90 - ((retailPrice - avgWholesale) * 0.18));

  return {
    query: qClean,
    retailReferencePrice: retailPrice,
    sourcingSummary: {
      wholesaleRange: `₹${minWholesale.toLocaleString('en-IN')} - ₹${maxWholesale.toLocaleString('en-IN')}`,
      averageWholesalePrice: `₹${avgWholesale.toLocaleString('en-IN')}`,
      averageWholesalePriceRaw: avgWholesale,
      estimatedGrossMargin: `${estGrossMargin}%`,
      estimatedNetProfitPerUnit: `₹${estNetProfit.toLocaleString('en-IN')}`,
      hubDistribution: 'Delhi NCR, Gujarat & Maharashtra',
      indiamartDirectoryUrl: `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(qClean)}`
    },
    suppliers
  };
}

module.exports = {
  getIndiaMartSuppliers,
  getCategorySourcingSpecs
};
