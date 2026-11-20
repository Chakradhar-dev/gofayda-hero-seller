// services/labelCropperEngine.js
// Shipping Label Crop, Sorter & Generator Engine for Amazon, Flipkart & Meesho
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const SAMPLE_ORDERS = [
  {
    id: 'ord-amz-001',
    orderId: '408-7291834-1029481',
    marketplace: 'amazon',
    marketplaceLabel: 'Amazon.in (Easy Ship)',
    deliveryPartner: 'Amazon Shipping (ATS)',
    awbBarcode: 'ATS982341029IN',
    routingCode: 'DEL/OKH-01',
    sku: 'GF-SMARTWATCH-BLK',
    productTitle: 'Noise ColorFit Pulse 2 Max Smartwatch (Deep Black)',
    quantity: 1,
    weight: '0.32 kg',
    paymentMode: 'Prepaid (Amazon Pay)',
    customerName: 'Amitabh Sharma',
    customerPhone: '+91 98112 •••••',
    customerAddress: 'Flat 402, Tower B, Sunshine Residency, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-AMZ-2026-9041'
  },
  {
    id: 'ord-fk-002',
    orderId: 'OD329817264810293000',
    marketplace: 'flipkart',
    marketplaceLabel: 'Flipkart Logistics',
    deliveryPartner: 'Ekart Logistics',
    awbBarcode: 'FMPC8172648190',
    routingCode: 'BLR/IND-04',
    sku: 'GF-SMARTWATCH-BLK',
    productTitle: 'Noise ColorFit Pulse 2 Max Smartwatch (Deep Black)',
    quantity: 1,
    weight: '0.32 kg',
    paymentMode: 'COD: ₹1,499',
    customerName: 'Kavita Rajesh Nair',
    customerPhone: '+91 94471 •••••',
    customerAddress: 'No. 24, 8th Cross, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-FK-2026-3192'
  },
  {
    id: 'ord-msh-003',
    orderId: 'MSH-81928471-1',
    marketplace: 'meesho',
    marketplaceLabel: 'Meesho Supplier Hub',
    deliveryPartner: 'Delhivery',
    awbBarcode: 'DEL49182736410IN',
    routingCode: 'BOM/KRL-02',
    sku: 'GF-TWS-PRO-WHT',
    productTitle: 'boAt Airdopes 141 Bluetooth TWS Earbuds (Ice White)',
    quantity: 2,
    weight: '0.28 kg',
    paymentMode: 'Prepaid (UPI)',
    customerName: 'Rohit Deshmukh',
    customerPhone: '+91 98200 •••••',
    customerAddress: 'Flat 1204, Sea Green Apartments, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400030',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-MSH-2026-1049'
  },
  {
    id: 'ord-amz-004',
    orderId: '408-3918274-9182736',
    marketplace: 'amazon',
    marketplaceLabel: 'Amazon.in (Easy Ship)',
    deliveryPartner: 'Delhivery',
    awbBarcode: 'DEL58291048291IN',
    routingCode: 'DEL/DWK-09',
    sku: 'GF-TWS-PRO-WHT',
    productTitle: 'boAt Airdopes 141 Bluetooth TWS Earbuds (Ice White)',
    quantity: 1,
    weight: '0.28 kg',
    paymentMode: 'Prepaid (Credit Card)',
    customerName: 'Pooja Sundaram',
    customerPhone: '+91 98711 •••••',
    customerAddress: 'Pocket B, Flat 18, Sector 14, Dwarka',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110078',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-AMZ-2026-9042'
  },
  {
    id: 'ord-fk-005',
    orderId: 'OD329817264810293001',
    marketplace: 'flipkart',
    marketplaceLabel: 'Flipkart Logistics',
    deliveryPartner: 'Shadowfax',
    awbBarcode: 'SFX7192837465',
    routingCode: 'HYD/HCH-03',
    sku: 'GF-AIRFRYER-5L',
    productTitle: 'AGARO Regal 5.5L Digital Air Fryer (Titanium Silver)',
    quantity: 1,
    weight: '4.80 kg',
    paymentMode: 'COD: ₹4,299',
    customerName: 'Venkat Reddy',
    customerPhone: '+91 99881 •••••',
    customerAddress: 'Plot 88, Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-FK-2026-3193'
  },
  {
    id: 'ord-msh-006',
    orderId: 'MSH-81928471-2',
    marketplace: 'meesho',
    marketplaceLabel: 'Meesho Supplier Hub',
    deliveryPartner: 'Shadowfax',
    awbBarcode: 'SFX6102938475',
    routingCode: 'JPR/MAL-01',
    sku: 'GF-AIRFRYER-5L',
    productTitle: 'AGARO Regal 5.5L Digital Air Fryer (Titanium Silver)',
    quantity: 1,
    weight: '4.80 kg',
    paymentMode: 'Prepaid (Net Banking)',
    customerName: 'Sanjay Rathore',
    customerPhone: '+91 94140 •••••',
    customerAddress: 'B-14, Malviya Nagar, Near Calgiri Hospital',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-MSH-2026-1050'
  },
  {
    id: 'ord-amz-007',
    orderId: '408-9102847-1928374',
    marketplace: 'amazon',
    marketplaceLabel: 'Amazon.in (Easy Ship)',
    deliveryPartner: 'Amazon Shipping (ATS)',
    awbBarcode: 'ATS719283019IN',
    routingCode: 'AMD/BOP-02',
    sku: 'GF-GAMING-KEYB',
    productTitle: 'Redragon K552 Mechanical RGB Gaming Keyboard (Red Switches)',
    quantity: 1,
    weight: '0.95 kg',
    paymentMode: 'Prepaid (UPI)',
    customerName: 'Jigar Shah',
    customerPhone: '+91 98980 •••••',
    customerAddress: '401, Galaxy Enclave, Bopal Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380058',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-AMZ-2026-9043'
  },
  {
    id: 'ord-fk-008',
    orderId: 'OD329817264810293002',
    marketplace: 'flipkart',
    marketplaceLabel: 'Flipkart Logistics',
    deliveryPartner: 'Ekart Logistics',
    awbBarcode: 'FMPC9182736450',
    routingCode: 'CCU/SLT-05',
    sku: 'GF-GAMING-KEYB',
    productTitle: 'Redragon K552 Mechanical RGB Gaming Keyboard (Red Switches)',
    quantity: 1,
    weight: '0.95 kg',
    paymentMode: 'Prepaid (Flipkart PayLater)',
    customerName: 'Subir Mukherjee',
    customerPhone: '+91 98301 •••••',
    customerAddress: 'Block CF, Sector 1, Salt Lake City',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700064',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-FK-2026-3194'
  },
  {
    id: 'ord-msh-009',
    orderId: 'MSH-81928471-3',
    marketplace: 'meesho',
    marketplaceLabel: 'Meesho Supplier Hub',
    deliveryPartner: 'Xpressbees',
    awbBarcode: 'XPB1029384756',
    routingCode: 'LKO/GOM-03',
    sku: 'GF-SHOES-UK9',
    productTitle: 'Men Lightweight Breathable Running Shoes (UK 9 / Olive Grey)',
    quantity: 1,
    weight: '0.65 kg',
    paymentMode: 'COD: ₹899',
    customerName: 'Aman Tripathi',
    customerPhone: '+91 94500 •••••',
    customerAddress: 'House 52, Vikas Khand, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-MSH-2026-1051'
  },
  {
    id: 'ord-amz-010',
    orderId: '408-5829104-7192830',
    marketplace: 'amazon',
    marketplaceLabel: 'Amazon.in (Easy Ship)',
    deliveryPartner: 'Delhivery',
    awbBarcode: 'DEL72910482910IN',
    routingCode: 'MAA/ADY-01',
    sku: 'GF-SHOES-UK9',
    productTitle: 'Men Lightweight Breathable Running Shoes (UK 9 / Olive Grey)',
    quantity: 1,
    weight: '0.65 kg',
    paymentMode: 'Prepaid (Amazon Pay)',
    customerName: 'Karthik Subramanian',
    customerPhone: '+91 98400 •••••',
    customerAddress: 'Flat 3C, Palm Grove, 2nd Avenue, Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-AMZ-2026-9044'
  },
  {
    id: 'ord-fk-011',
    orderId: 'OD329817264810293003',
    marketplace: 'flipkart',
    marketplaceLabel: 'Flipkart Logistics',
    deliveryPartner: 'Ekart Logistics',
    awbBarcode: 'FMPC7291048291',
    routingCode: 'PNQ/KOT-02',
    sku: 'GF-SMARTWATCH-WINE',
    productTitle: 'Noise ColorFit Pulse 2 Max Smartwatch (Wine Red Edition)',
    quantity: 1,
    weight: '0.32 kg',
    paymentMode: 'Prepaid (UPI)',
    customerName: 'Pranav Joshi',
    customerPhone: '+91 97650 •••••',
    customerAddress: 'B-12, Mayur Colony, Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-FK-2026-3195'
  },
  {
    id: 'ord-msh-012',
    orderId: 'MSH-81928471-4',
    marketplace: 'meesho',
    marketplaceLabel: 'Meesho Supplier Hub',
    deliveryPartner: 'Xpressbees',
    awbBarcode: 'XPB9182736450',
    routingCode: 'PAT/BOR-01',
    sku: 'GF-SMARTWATCH-WINE',
    productTitle: 'Noise ColorFit Pulse 2 Max Smartwatch (Wine Red Edition)',
    quantity: 1,
    weight: '0.32 kg',
    paymentMode: 'COD: ₹1,499',
    customerName: 'Abhishek Kumar Sinha',
    customerPhone: '+91 93340 •••••',
    customerAddress: 'House 14, Anandpuri, Boring Canal Road',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    sellerName: 'Gofayda Hero Seller Hub LLP',
    sellerAddress: 'Plot 45, Okhla Industrial Area Phase-III, New Delhi',
    sellerGstin: '07AAAAA1234A1Z5',
    orderDate: '11-Nov-2026',
    invoiceNumber: 'INV-MSH-2026-1052'
  }
];

function getSampleOrders() {
  // Return deep clone of sample orders
  return JSON.parse(JSON.stringify(SAMPLE_ORDERS));
}

function sortOrders(orders, sortBy = 'sku-asc') {
  const list = [...orders];

  switch (sortBy) {
    case 'sku-asc':
      return list.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''));
    
    case 'sku-desc':
      return list.sort((a, b) => (b.sku || '').localeCompare(a.sku || ''));
    
    case 'delivery-partner':
    case 'delivery-asc':
      return list.sort((a, b) => {
        const dpCmp = (a.deliveryPartner || '').localeCompare(b.deliveryPartner || '');
        if (dpCmp !== 0) return dpCmp;
        return (a.sku || '').localeCompare(b.sku || '');
      });

    case 'delivery-desc':
      return list.sort((a, b) => {
        const dpCmp = (b.deliveryPartner || '').localeCompare(a.deliveryPartner || '');
        if (dpCmp !== 0) return dpCmp;
        return (a.sku || '').localeCompare(b.sku || '');
      });

    case 'sku-then-partner':
      return list.sort((a, b) => {
        const skuCmp = (a.sku || '').localeCompare(b.sku || '');
        if (skuCmp !== 0) return skuCmp;
        return (a.deliveryPartner || '').localeCompare(b.deliveryPartner || '');
      });

    case 'marketplace':
      return list.sort((a, b) => {
        const mCmp = (a.marketplace || '').localeCompare(b.marketplace || '');
        if (mCmp !== 0) return mCmp;
        return (a.sku || '').localeCompare(b.sku || '');
      });

    case 'pincode':
      return list.sort((a, b) => (a.pincode || '').localeCompare(b.pincode || ''));

    default:
      return list;
  }
}

function filterOrders(orders, filters = {}) {
  let list = [...orders];

  if (filters.marketplace && filters.marketplace !== 'all') {
    list = list.filter(o => o.marketplace === filters.marketplace);
  }

  if (filters.deliveryPartner && filters.deliveryPartner !== 'all') {
    list = list.filter(o => o.deliveryPartner === filters.deliveryPartner);
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    list = list.filter(o => 
      (o.sku && o.sku.toLowerCase().includes(q)) ||
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.city && o.city.toLowerCase().includes(q)) ||
      (o.pincode && o.pincode.includes(q)) ||
      (o.awbBarcode && o.awbBarcode.toLowerCase().includes(q))
    );
  }

  return list;
}

function generateSummary(orders) {
  const totalOrders = orders.length;
  const totalUnits = orders.reduce((sum, o) => sum + (parseInt(o.quantity, 10) || 1), 0);

  // Group by SKU
  const skuMap = {};
  orders.forEach(o => {
    const s = o.sku || 'UNKNOWN-SKU';
    if (!skuMap[s]) {
      skuMap[s] = {
        sku: s,
        productTitle: o.productTitle || s,
        totalQty: 0,
        orderCount: 0,
        marketplaces: new Set(),
        deliveryPartners: new Set()
      };
    }
    skuMap[s].totalQty += (parseInt(o.quantity, 10) || 1);
    skuMap[s].orderCount += 1;
    skuMap[s].marketplaces.add(o.marketplace);
    skuMap[s].deliveryPartners.add(o.deliveryPartner);
  });

  const skuSummary = Object.values(skuMap).map(item => ({
    sku: item.sku,
    productTitle: item.productTitle,
    totalQty: item.totalQty,
    orderCount: item.orderCount,
    marketplaces: Array.from(item.marketplaces),
    deliveryPartners: Array.from(item.deliveryPartners)
  })).sort((a, b) => b.totalQty - a.totalQty);

  // Group by Delivery Partner
  const courierMap = {};
  orders.forEach(o => {
    const c = o.deliveryPartner || 'Standard Courier';
    if (!courierMap[c]) {
      courierMap[c] = { courier: c, count: 0, units: 0 };
    }
    courierMap[c].count += 1;
    courierMap[c].units += (parseInt(o.quantity, 10) || 1);
  });

  const courierSummary = Object.values(courierMap).map(c => ({
    ...c,
    percentage: totalOrders > 0 ? Math.round((c.count / totalOrders) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // Group by Marketplace
  const marketplaceCounts = {
    amazon: orders.filter(o => o.marketplace === 'amazon').length,
    flipkart: orders.filter(o => o.marketplace === 'flipkart').length,
    meesho: orders.filter(o => o.marketplace === 'meesho').length
  };

  return {
    totalOrders,
    totalUnits,
    skuCount: Object.keys(skuMap).length,
    skuSummary,
    courierSummary,
    marketplaceCounts
  };
}

async function drawLabelOrImage(pdfDoc, page, order, x, y, width, height, fontBold, fontRegular, fontMono, options = {}) {
  if (order.croppedDataUrl && typeof order.croppedDataUrl === 'string' && order.croppedDataUrl.startsWith('data:image')) {
    try {
      const base64Data = order.croppedDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      const isPng = order.croppedDataUrl.includes('image/png');
      const img = isPng 
        ? await pdfDoc.embedPng(imgBuffer).catch(() => pdfDoc.embedJpg(imgBuffer))
        : await pdfDoc.embedJpg(imgBuffer).catch(() => pdfDoc.embedPng(imgBuffer));
      
      if (img) {
        page.drawRectangle({
          x,
          y,
          width,
          height,
          borderColor: rgb(0.1, 0.1, 0.1),
          borderWidth: 1,
          color: rgb(1, 1, 1)
        });
        page.drawImage(img, {
          x: x + 2,
          y: y + 2,
          width: width - 4,
          height: height - 4
        });
        return;
      }
    } catch (e) {
      console.warn('Could not embed cropped image in PDF, falling back to vector label:', e.message);
    }
  }

  drawSingleThermalLabel(page, order, x, y, width, height, fontBold, fontRegular, fontMono, options);
}

/**
 * Generate a real printable PDF via pdf-lib
 * @param {Array} orders - List of sorted orders
 * @param {string} format - 'thermal' (4x6 inch) or 'a4' (4 labels per page, 2x2 grid)
 * @param {object} options - Options like showGuides, cropPreset
 */
async function generatePdf(orders, format = 'thermal', options = {}) {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.CourierBold);

  if (format === 'thermal') {
    // 4" x 6" in points: 1 inch = 72 pt => 4 * 72 = 288 pt, 6 * 72 = 432 pt
    const width = 288;
    const height = 432;

    for (const order of orders) {
      const page = pdfDoc.addPage([width, height]);
      await drawLabelOrImage(pdfDoc, page, order, 0, 0, width, height, fontBold, fontRegular, fontMono, options);
    }
  } else {
    // A4 sheet: 595.28 pt x 841.89 pt (210mm x 297mm)
    // 4 labels per page in 2x2 grid
    const a4Width = 595.28;
    const a4Height = 841.89;
    const margin = 18; // ~6.3 mm
    const cellWidth = (a4Width - (margin * 2)) / 2;
    const cellHeight = (a4Height - (margin * 2)) / 2;

    const totalPages = Math.ceil(orders.length / 4);

    for (let p = 0; p < totalPages; p++) {
      const page = pdfDoc.addPage([a4Width, a4Height]);
      const chunk = orders.slice(p * 4, (p + 1) * 4);

      // Grid positions:
      // Row 0 (Top): Left = chunk[0], Right = chunk[1]
      // Row 1 (Bottom): Left = chunk[2], Right = chunk[3]
      const positions = [
        { x: margin, y: margin + cellHeight }, // Top-Left
        { x: margin + cellWidth, y: margin + cellHeight }, // Top-Right
        { x: margin, y: margin }, // Bottom-Left
        { x: margin + cellWidth, y: margin } // Bottom-Right
      ];

      // Draw dashed / solid cut lines between labels on A4
      if (options.showCutGuides !== false) {
        // Vertical center line
        page.drawLine({
          start: { x: a4Width / 2, y: margin },
          end: { x: a4Width / 2, y: a4Height - margin },
          thickness: 0.75,
          color: rgb(0.7, 0.7, 0.7),
          dashArray: [4, 4]
        });
        // Horizontal center line
        page.drawLine({
          start: { x: margin, y: a4Height / 2 },
          end: { x: a4Width - margin, y: a4Height / 2 },
          thickness: 0.75,
          color: rgb(0.7, 0.7, 0.7),
          dashArray: [4, 4]
        });
      }

      for (let idx = 0; idx < chunk.length; idx++) {
        const order = chunk[idx];
        const pos = positions[idx];
        await drawLabelOrImage(
          pdfDoc,
          page,
          order,
          pos.x + 4,
          pos.y + 4,
          cellWidth - 8,
          cellHeight - 8,
          fontBold,
          fontRegular,
          fontMono,
          options
        );
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/₹/g, 'Rs.')
    .replace(/[^\x00-\x7F]/g, ''); // strip non-ascii for StandardFonts WinAnsi compatibility
}

// Draw label within a bounding box
function drawSingleThermalLabel(page, order, originX, originY, width, height, fontBold, fontRegular, fontMono, options = {}) {
  // Border box
  page.drawRectangle({
    x: originX,
    y: originY,
    width,
    height,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 1.2,
    color: rgb(1, 1, 1)
  });

  const pad = 8;
  let curY = originY + height - pad;

  // Header Bar: Marketplace Badge + Courier
  const headerHeight = 26;
  const isAmz = order.marketplace === 'amazon';
  const isFk = order.marketplace === 'flipkart';
  const isMsh = order.marketplace === 'meesho';

  // Fill Header Bar color
  page.drawRectangle({
    x: originX,
    y: curY - headerHeight + 6,
    width,
    height: headerHeight,
    color: isAmz ? rgb(0.98, 0.88, 0.7) : isFk ? rgb(0.85, 0.92, 1) : rgb(0.98, 0.85, 0.95)
  });

  const mpTitle = isAmz ? 'AMAZON.IN EASY SHIP' : isFk ? 'FLIPKART LOGISTICS' : 'MEESHO SUPPLIER';
  page.drawText(sanitizeText(mpTitle), {
    x: originX + pad,
    y: curY - 12,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  // Routing Code Badge
  const routeText = sanitizeText(order.routingCode || 'DEL/HUB');
  page.drawText(routeText, {
    x: originX + width - pad - (routeText.length * 6.5),
    y: curY - 12,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  curY -= (headerHeight + 6);

  // Delivery Partner Line
  page.drawText(sanitizeText(`Carrier: ${order.deliveryPartner}`), {
    x: originX + pad,
    y: curY,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  const modeText = sanitizeText(`Mode: ${order.paymentMode}`);
  page.drawText(modeText, {
    x: originX + width - pad - 110,
    y: curY,
    size: 8.5,
    font: fontBold,
    color: order.paymentMode.includes('COD') ? rgb(0.8, 0.1, 0.1) : rgb(0.05, 0.5, 0.2)
  });

  curY -= 14;

  // Horizontal divider
  page.drawLine({
    start: { x: originX + pad, y: curY },
    end: { x: originX + width - pad, y: curY },
    thickness: 0.8,
    color: rgb(0.3, 0.3, 0.3)
  });

  curY -= 12;

  // AWB Barcode Simulation (Crisp high-contrast lines)
  const barcodeY = curY - 24;
  drawSimulatedBarcode(page, originX + pad + 10, barcodeY, width - (pad * 2) - 20, 24, order.awbBarcode);
  curY = barcodeY - 10;

  // AWB text
  page.drawText(sanitizeText(`AWB: ${order.awbBarcode}`), {
    x: originX + (width / 2) - 45,
    y: curY,
    size: 8.5,
    font: fontMono,
    color: rgb(0, 0, 0)
  });

  curY -= 14;

  // Horizontal divider
  page.drawLine({
    start: { x: originX + pad, y: curY },
    end: { x: originX + width - pad, y: curY },
    thickness: 0.8,
    color: rgb(0.3, 0.3, 0.3)
  });

  curY -= 12;

  // Customer Shipping Address
  page.drawText('SHIP TO / DELIVER TO:', {
    x: originX + pad,
    y: curY,
    size: 8,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2)
  });

  curY -= 12;
  page.drawText(sanitizeText(order.customerName || 'Customer'), {
    x: originX + pad,
    y: curY,
    size: 9.5,
    font: fontBold,
    color: rgb(0, 0, 0)
  });

  curY -= 11;
  const addr1 = sanitizeText((order.customerAddress || '').slice(0, 42));
  page.drawText(addr1, {
    x: originX + pad,
    y: curY,
    size: 8,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1)
  });

  curY -= 11;
  page.drawText(sanitizeText(`${order.city}, ${order.state}`), {
    x: originX + pad,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1)
  });

  // Large Bold Pincode Box for Couriers
  const pinBoxWidth = 85;
  const pinBoxHeight = 22;
  page.drawRectangle({
    x: originX + width - pad - pinBoxWidth,
    y: curY - 4,
    width: pinBoxWidth,
    height: pinBoxHeight,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.2
  });
  page.drawText(sanitizeText(`PIN: ${order.pincode}`), {
    x: originX + width - pad - pinBoxWidth + 6,
    y: curY + 2,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0)
  });

  curY -= 20;

  // Divider
  page.drawLine({
    start: { x: originX + pad, y: curY },
    end: { x: originX + width - pad, y: curY },
    thickness: 0.8,
    color: rgb(0.3, 0.3, 0.3)
  });

  curY -= 12;

  // SKU & ITEM DETAILS (Critical for Indian Warehouses)
  page.drawRectangle({
    x: originX + pad,
    y: curY - 28,
    width: width - (pad * 2),
    height: 38,
    color: rgb(0.96, 0.96, 0.96),
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1
  });

  page.drawText('PRODUCT SKU / DISPATCH IDENTIFIER:', {
    x: originX + pad + 6,
    y: curY - 2,
    size: 7.5,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3)
  });

  page.drawText(sanitizeText(`SKU: ${order.sku}`), {
    x: originX + pad + 6,
    y: curY - 14,
    size: 10,
    font: fontBold,
    color: rgb(0, 0, 0)
  });

  page.drawText(sanitizeText(`QTY: ${order.quantity} | Wt: ${order.weight || '0.3kg'}`), {
    x: originX + width - pad - 100,
    y: curY - 14,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0)
  });

  const pTitle = sanitizeText((order.productTitle || '').slice(0, 42));
  page.drawText(pTitle, {
    x: originX + pad + 6,
    y: curY - 25,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2)
  });

  curY -= 42;

  // Order & Invoice Numbers
  page.drawText(sanitizeText(`Order ID: ${order.orderId}`), {
    x: originX + pad,
    y: curY,
    size: 7.5,
    font: fontMono,
    color: rgb(0.2, 0.2, 0.2)
  });

  curY -= 10;
  page.drawText(sanitizeText(`Date: ${order.orderDate} | Inv: ${order.invoiceNumber}`), {
    x: originX + pad,
    y: curY,
    size: 7,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3)
  });

  curY -= 12;

  // Return / Seller Address Footer
  page.drawLine({
    start: { x: originX + pad, y: curY },
    end: { x: originX + width - pad, y: curY },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6)
  });

  curY -= 9;
  page.drawText(sanitizeText(`If undelivered, return to: ${order.sellerName}`), {
    x: originX + pad,
    y: curY,
    size: 6.5,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3)
  });

  curY -= 8;
  page.drawText(sanitizeText(`${order.sellerAddress} | GSTIN: ${order.sellerGstin}`), {
    x: originX + pad,
    y: curY,
    size: 6,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4)
  });
}

// Generate realistic crisp barcode stripes
function drawSimulatedBarcode(page, x, y, width, height, text) {
  const seed = (text || 'AWB123456789').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const barCount = 42;
  const barWidth = width / (barCount * 1.5);

  let curX = x;
  for (let i = 0; i < barCount; i++) {
    const isThick = ((seed * (i + 1)) % 5) === 0;
    const isMedium = ((seed * (i + 1)) % 3) === 0;
    const w = isThick ? barWidth * 2.2 : isMedium ? barWidth * 1.4 : barWidth * 0.9;

    page.drawRectangle({
      x: curX,
      y,
      width: w,
      height,
      color: rgb(0, 0, 0)
    });

    const gap = isThick ? barWidth * 1.5 : barWidth * 1.1;
    curX += (w + gap);
    if (curX > x + width - 5) break;
  }
}

module.exports = {
  SAMPLE_ORDERS,
  getSampleOrders,
  sortOrders,
  filterOrders,
  generateSummary,
  generatePdf
};
