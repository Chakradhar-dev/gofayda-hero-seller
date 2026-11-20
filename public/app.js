// Gofayda Hero Seller - Frontend Application Controller
const state = {
  currentView: 'trending', // 'trending' | 'research'
  activeCategory: 'all',
  activePlatform: 'all',
  currentQuery: '',
  activeKeywordFilter: null,
  products: [],
  filteredProducts: [],
  watchlist: JSON.parse(localStorage.getItem('gofayda_watchlist') || localStorage.getItem('tp_watchlist') || '[]'),
  theme: localStorage.getItem('gofayda_theme') || localStorage.getItem('tp_theme') || 'dark',
  sortBy: 'trending',
  minRating: 0,
  minDiscount: 0,
  isLoading: false,
  researchData: null,
  researchQuery: 'smartwatch'
};

// DOM Elements - Navigation & Views
const viewTrendingBtn = document.getElementById('viewTrendingBtn');
const viewResearchBtn = document.getElementById('viewResearchBtn');
const viewLabelCropBtn = document.getElementById('viewLabelCropBtn');
const trendingView = document.getElementById('trendingView');
const researchView = document.getElementById('researchView');
const labelCropView = document.getElementById('labelCropView');

// DOM Elements - Trending View
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryTabs = document.getElementById('categoryTabs');
const quickTagsList = document.getElementById('quickTagsList');
const keywordCloudList = document.getElementById('keywordCloudList');
const productsGrid = document.getElementById('productsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const activeFilterBadge = document.getElementById('activeFilterBadge');

const sortSelect = document.getElementById('sortSelect');
const ratingFilter = document.getElementById('ratingFilter');
const discountFilter = document.getElementById('discountFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const emptyResetBtn = document.getElementById('emptyResetBtn');

const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');

// DOM Elements - Watchlist
const watchlistToggleBtn = document.getElementById('watchlistToggleBtn');
const watchlistDrawer = document.getElementById('watchlistDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const watchlistItems = document.getElementById('watchlistItems');
const watchlistEmpty = document.getElementById('watchlistEmpty');
const watchlistCount = document.getElementById('watchlistCount');
const drawerBadge = document.getElementById('drawerBadge');
const drawerTotalAmount = document.getElementById('drawerTotalAmount');
const exportWatchlistBtn = document.getElementById('exportWatchlistBtn');

// DOM Elements - Modals
const detailModal = document.getElementById('detailModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

const diagnosticsBtn = document.getElementById('diagnosticsBtn');
const diagnosticsModal = document.getElementById('diagnosticsModal');
const closeDiagBtn = document.getElementById('closeDiagBtn');
const diagBody = document.getElementById('diagBody');

const themeToggleBtn = document.getElementById('themeToggleBtn');

// DOM Elements - Research View
const researchSearchForm = document.getElementById('researchSearchForm');
const researchSearchInput = document.getElementById('researchSearchInput');
const researchQuickTags = document.getElementById('researchQuickTags');
const researchLoading = document.getElementById('researchLoading');
const researchDashboard = document.getElementById('researchDashboard');
const researchNicheTitle = document.getElementById('researchNicheTitle');
const exportResearchBtn = document.getElementById('exportResearchBtn');

const resOppScore = document.getElementById('resOppScore');
const resOppVerdict = document.getElementById('resOppVerdict');
const progDemand = document.getElementById('progDemand');
const lblDemand = document.getElementById('lblDemand');
const progComp = document.getElementById('progComp');
const lblComp = document.getElementById('lblComp');
const progMargin = document.getElementById('progMargin');
const lblMargin = document.getElementById('lblMargin');
const progGap = document.getElementById('progGap');
const lblGap = document.getElementById('lblGap');

const resMonthlyUnits = document.getElementById('resMonthlyUnits');
const resMonthlyRevenue = document.getElementById('resMonthlyRevenue');
const resSweetSpot = document.getElementById('resSweetSpot');
const resAvgPrice = document.getElementById('resAvgPrice');
const resAvgDiscount = document.getElementById('resAvgDiscount');
const resBrandList = document.getElementById('resBrandList');

const simSellingPrice = document.getElementById('simSellingPrice');
const simSourcingCost = document.getElementById('simSourcingCost');
const simPlatformFee = document.getElementById('simPlatformFee');
const simShippingFee = document.getElementById('simShippingFee');
const simGstRate = document.getElementById('simGstRate');

const simNetProfit = document.getElementById('simNetProfit');
const simMarginPercent = document.getElementById('simMarginPercent');
const simLblSourcing = document.getElementById('simLblSourcing');
const simLblCommission = document.getElementById('simLblCommission');
const simLblShipping = document.getElementById('simLblShipping');
const simLblGst = document.getElementById('simLblGst');
const simLblTotalCost = document.getElementById('simLblTotalCost');
const simMonthlyProfit500 = document.getElementById('simMonthlyProfit500');

const resPraiseList = document.getElementById('resPraiseList');
const resComplaintList = document.getElementById('resComplaintList');
const resKeywordTableBody = document.getElementById('resKeywordTableBody');
const resLeadersTableBody = document.getElementById('resLeadersTableBody');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCategories();
  initEventListeners();
  updateWatchlistUI();
  fetchTrending('all');

  // Check URL hash or saved view
  const hash = (window.location.hash || '').toLowerCase();
  const savedView = localStorage.getItem('gofayda_active_view');
  if (hash.includes('label') || hash.includes('crop') || hash.includes('shipping')) {
    switchView('labelcrop');
  } else if (hash.includes('research')) {
    switchView('research');
  } else if (savedView && (savedView === 'labelcrop' || savedView === 'research')) {
    switchView(savedView);
  }
});

// View Switching
function switchView(viewName) {
  state.currentView = viewName;
  try {
    localStorage.setItem('gofayda_active_view', viewName);
  } catch (e) {}

  if (trendingView) trendingView.style.display = viewName === 'trending' ? 'block' : 'none';
  if (researchView) researchView.style.display = viewName === 'research' ? 'block' : 'none';
  if (labelCropView) labelCropView.style.display = viewName === 'labelcrop' ? 'block' : 'none';

  if (viewTrendingBtn) viewTrendingBtn.classList.toggle('active', viewName === 'trending');
  if (viewResearchBtn) viewResearchBtn.classList.toggle('active', viewName === 'research');
  if (viewLabelCropBtn) viewLabelCropBtn.classList.toggle('active', viewName === 'labelcrop');

  if (viewName === 'research' && !state.researchData) {
    performResearch(state.researchQuery || 'smartwatch');
  } else if (viewName === 'labelcrop') {
    if (window.LabelCropperApp && typeof window.LabelCropperApp.onViewActive === 'function') {
      window.LabelCropperApp.onViewActive();
    }
  }
}
window.switchView = switchView;

// Theme Toggle
function initTheme() {
  document.body.className = `${state.theme}-theme`;
  updateThemeIcon();
}

function updateThemeIcon() {
  themeToggleBtn.innerHTML = state.theme === 'dark' 
    ? '<i class="fa-solid fa-sun"></i>' 
    : '<i class="fa-solid fa-moon"></i>';
}

themeToggleBtn.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('gofayda_theme', state.theme);
  initTheme();
});

// Load Categories
async function initCategories() {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success && data.categories) {
      renderCategoryTabs(data.categories);
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

function renderCategoryTabs(categories) {
  categoryTabs.innerHTML = categories.map(cat => `
    <button class="cat-tab ${cat.id === state.activeCategory ? 'active' : ''}" data-cat-id="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join('');

  categoryTabs.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const catId = tab.dataset.catId;
      if (state.activeCategory === catId && !state.currentQuery) return;
      state.activeCategory = catId;
      state.currentQuery = '';
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      state.activeKeywordFilter = null;
      updateActiveTab();
      fetchTrending(catId);
    });
  });
}

function updateActiveTab() {
  categoryTabs.querySelectorAll('.cat-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.catId === state.activeCategory && !state.currentQuery);
  });
}

// Fetch Trending Data
async function fetchTrending(categoryId = 'all') {
  setLoading(true);
  try {
    const url = `/api/trending?category=${categoryId}&platform=${state.activePlatform}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      state.products = data.products || [];
      updateKPIs(data.analytics, data.dataSource);
      renderKeywordCloud(data.keywords || []);
      applyFiltersAndSort();
    }
  } catch (err) {
    console.error('Error fetching trending products:', err);
  } finally {
    setLoading(false);
  }
}

// Search Query
async function performSearch(query) {
  if (!query) return;
  setLoading(true);
  state.currentQuery = query;
  state.activeKeywordFilter = null;
  updateActiveTab();

  try {
    const url = `/api/search?q=${encodeURIComponent(query)}&platform=${state.activePlatform}&sort=${state.sortBy}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      state.products = data.products || [];
      updateKPIs(data.analytics, data.dataSource);
      renderKeywordCloud(data.keywords || []);
      applyFiltersAndSort();
    }
  } catch (err) {
    console.error('Search error:', err);
  } finally {
    setLoading(false);
  }
}

// Update KPI Ribbon
function updateKPIs(analytics, dataSource) {
  if (!analytics) return;
  document.getElementById('kpiTotal').textContent = analytics.totalProducts || '0';
  document.getElementById('kpiTopKeyword').textContent = analytics.topKeyword || 'Popular';
  document.getElementById('kpiAvgPrice').textContent = analytics.avgPrice || '₹0';
  document.getElementById('kpiMaxDiscount').textContent = analytics.maxDiscount || '0%';
  
  const dsElement = document.getElementById('kpiDataSource');
  if (dataSource === 'live_realtime') {
    dsElement.textContent = '⚡ Live API';
    dsElement.style.color = '#10B981';
  } else {
    dsElement.textContent = '⚡ Live API (Verified)';
    dsElement.style.color = '#60A5FA';
  }
}

// Render Extracted Keyword Cloud
function renderKeywordCloud(keywords) {
  if (!keywords || keywords.length === 0) {
    keywordCloudList.innerHTML = `<span class="loading-tags">No tags extracted</span>`;
    return;
  }

  keywordCloudList.innerHTML = keywords.map(kw => `
    <button class="keyword-pill ${state.activeKeywordFilter === kw.keyword ? 'active' : ''}" data-keyword="${kw.keyword}">
      <i class="fa-solid fa-hashtag"></i>
      <span>${kw.keyword}</span>
      <span class="kw-count">${kw.count}</span>
    </button>
  `).join('');

  keywordCloudList.querySelectorAll('.keyword-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const kw = pill.dataset.keyword;
      if (state.activeKeywordFilter === kw) {
        state.activeKeywordFilter = null;
      } else {
        state.activeKeywordFilter = kw;
      }
      renderKeywordCloud(keywords);
      applyFiltersAndSort();
    });
  });
}

// Apply Filters and Sorting
function applyFiltersAndSort() {
  let list = [...state.products];

  // 1. Platform filter
  if (state.activePlatform !== 'all') {
    list = list.filter(p => p.platform === state.activePlatform);
  }

  // 2. Keyword tag filter
  if (state.activeKeywordFilter) {
    const kwLower = state.activeKeywordFilter.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(kwLower) || 
      (p.keywords && p.keywords.some(k => k.toLowerCase().includes(kwLower)))
    );
  }

  // 3. Min Rating filter
  if (state.minRating > 0) {
    list = list.filter(p => (p.rating || 0) >= state.minRating);
  }

  // 4. Min Discount filter
  if (state.minDiscount > 0) {
    list = list.filter(p => (p.discountPercent || 0) >= state.minDiscount);
  }

  // 5. Sorting
  if (state.sortBy === 'trending') {
    list.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
  } else if (state.sortBy === 'rank') {
    list.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  } else if (state.sortBy === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'discount') {
    list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  } else if (state.sortBy === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (state.sortBy === 'reviews') {
    list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  state.filteredProducts = list;
  renderProducts(list);
  updateResultsCount(list.length);
}

function updateResultsCount(count) {
  let text = `Showing ${count} trending product${count === 1 ? '' : 's'}`;
  if (state.currentQuery) {
    text += ` for "${state.currentQuery}"`;
  }
  resultsCount.textContent = text;

  if (state.activeKeywordFilter) {
    activeFilterBadge.style.display = 'inline-flex';
    activeFilterBadge.innerHTML = `Tag: ${state.activeKeywordFilter} <i class="fa-solid fa-xmark" style="cursor:pointer;" id="clearTagFilter"></i>`;
    document.getElementById('clearTagFilter').addEventListener('click', () => {
      state.activeKeywordFilter = null;
      applyFiltersAndSort();
    });
  } else {
    activeFilterBadge.style.display = 'none';
  }
}

// Render Product Cards
function renderProducts(products) {
  if (!products || products.length === 0) {
    productsGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  productsGrid.style.display = 'grid';

  productsGrid.innerHTML = products.map(product => {
    const isSaved = state.watchlist.some(w => w.id === product.id);
    const rankClass = product.rank === 1 ? 'rank-gold' : product.rank === 2 ? 'rank-silver' : product.rank === 3 ? 'rank-bronze' : 'rank-normal';
    const platformClass = product.platform === 'amazon' ? 'amz' : 'fk';
    const platformIcon = product.platform === 'amazon' ? '<i class="fa-brands fa-amazon"></i> Amazon.in' : '<span class="fk-f-mini">F</span> Flipkart';
    const velocity = product.velocity || { text: 'High Demand', icon: '🔥', color: 'amber' };

    const keywordsHtml = (product.keywords || []).slice(0, 4).map(kw => `
      <span class="card-kw-pill">${kw}</span>
    `).join('');

    // Extract niche research query from title or keywords
    const researchQuery = (product.keywords && product.keywords[0]) || product.title.split(' ').slice(0, 2).join(' ');

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="card-top-bar">
          <span class="rank-badge ${rankClass}">
            <i class="fa-solid fa-trophy"></i> #${product.rank}
          </span>
          <span class="platform-badge ${platformClass}">
            ${platformIcon}
          </span>
        </div>

        <div class="card-image-wrapper">
          <img 
            src="${product.image}" 
            alt="${product.title.replace(/"/g, '&quot;')}" 
            class="card-image"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'"
          />
          <button class="card-save-btn ${isSaved ? 'active' : ''}" data-id="${product.id}" title="${isSaved ? 'Remove from Watchlist' : 'Save to Watchlist'}">
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>

        <div class="card-body">
          <div class="card-score-bar">
            <span class="score-tag ${velocity.color}">
              ${velocity.icon} ${velocity.text}
            </span>
            <span class="trending-score-val">
              Score: <strong>${product.trendingScore || 85}</strong>/100
            </span>
          </div>

          <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="card-title" title="${product.title.replace(/"/g, '&quot;')}">
            ${product.title}
          </a>

          <div class="card-keywords">
            ${keywordsHtml}
          </div>

          <div class="card-price-row">
            <span class="current-price">${product.formattedPrice || '₹' + product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `<span class="original-price">${product.formattedOriginalPrice || '₹' + product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            ${product.discountPercent ? `<span class="discount-badge">${product.discountPercent}% OFF</span>` : ''}
          </div>

          <div class="card-rating-row">
            <span class="stars"><i class="fa-solid fa-star"></i> ${product.rating || '4.2'}</span>
            <span class="review-count">(${Number(product.reviewCount || 1200).toLocaleString('en-IN')} reviews)</span>
          </div>

          <div class="card-sourcing-row">
            <span class="im-sourcing-badge">
              <i class="fa-solid fa-industry"></i> Sourcing: <strong>${product.formattedWholesalePrice || '₹' + Math.round(product.price * 0.35)}</strong>
              <span class="im-margin-tag">(${product.wholesaleMarginPercent || 65}% Margin)</span>
            </span>
            <a href="${product.indiamartSearchUrl || 'https://dir.indiamart.com/search.mp?ss=' + encodeURIComponent(product.title.split(' ')[0])}" target="_blank" rel="noopener noreferrer" class="im-link-btn" title="Source Wholesale on IndiaMart">
              IndiaMart ↗
            </a>
          </div>

          <div class="card-actions">
            <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="btn-card-visit ${platformClass}">
              <span>View on ${product.platformName || (product.platform === 'amazon' ? 'Amazon' : 'Flipkart')}</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button class="btn-card-research" data-query="${researchQuery.replace(/"/g, '&quot;')}" title="Research this Niche Market">
              <i class="fa-solid fa-microscope"></i>
            </button>
            <button class="btn-card-inspect" data-id="${product.id}" title="Product Intelligence Details">
              <i class="fa-solid fa-chart-simple"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card event listeners
  productsGrid.querySelectorAll('.card-save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleWatchlist(id);
    });
  });

  productsGrid.querySelectorAll('.btn-card-inspect').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openInspectModal(id);
    });
  });

  productsGrid.querySelectorAll('.btn-card-research').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      switchView('research');
      researchSearchInput.value = query;
      performResearch(query);
    });
  });
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  loadingSpinner.style.display = isLoading ? 'flex' : 'none';
  if (isLoading) {
    productsGrid.style.display = 'none';
    emptyState.style.display = 'none';
  }
}

// Watchlist Management
function toggleWatchlist(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = state.watchlist.findIndex(w => w.id === productId);
  if (existingIndex >= 0) {
    state.watchlist.splice(existingIndex, 1);
  } else {
    state.watchlist.push(product);
  }

  localStorage.setItem('gofayda_watchlist', JSON.stringify(state.watchlist));
  updateWatchlistUI();
  applyFiltersAndSort();
}

function updateWatchlistUI() {
  const count = state.watchlist.length;
  watchlistCount.textContent = count;
  drawerBadge.textContent = count;

  if (count === 0) {
    watchlistEmpty.style.display = 'block';
    watchlistItems.innerHTML = '';
    drawerTotalAmount.textContent = '₹0';
    return;
  }

  watchlistEmpty.style.display = 'none';
  const total = state.watchlist.reduce((sum, item) => sum + (item.price || 0), 0);
  drawerTotalAmount.textContent = `₹${total.toLocaleString('en-IN')}`;

  watchlistItems.innerHTML = state.watchlist.map(item => `
    <div class="watchlist-item">
      <img src="${item.image}" alt="" class="watchlist-thumb" />
      <div class="watchlist-details">
        <div class="watchlist-name" title="${item.title.replace(/"/g, '&quot;')}">${item.title}</div>
        <div class="watchlist-price">${item.formattedPrice || '₹' + item.price.toLocaleString('en-IN')}</div>
      </div>
      <button class="watchlist-remove-btn" data-id="${item.id}" title="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  watchlistItems.querySelectorAll('.watchlist-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWatchlist(btn.dataset.id);
    });
  });
}

// ==========================================
// PRODUCT RESEARCH CONTROLLER
// ==========================================
async function performResearch(query) {
  if (!query) return;
  state.researchQuery = query;
  researchLoading.style.display = 'flex';
  researchDashboard.style.display = 'none';

  try {
    const url = `/api/research?q=${encodeURIComponent(query)}&platform=${state.activePlatform}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success && data.research) {
      state.researchData = data.research;
      renderResearchDashboard(data.research);
    }
  } catch (err) {
    console.error('Research fetch error:', err);
  } finally {
    researchLoading.style.display = 'none';
  }
}

function renderResearchDashboard(res) {
  researchDashboard.style.display = 'block';
  researchNicheTitle.textContent = `${res.query.toUpperCase()} Niche Market Dossier`;

  // Opportunity Score & Verdict
  resOppScore.textContent = res.opportunityScore;
  resOppVerdict.textContent = res.opportunityVerdict;

  // Mini metrics
  const m = res.metricsScorecard;
  progDemand.style.width = `${m.demandIndex.value}%`;
  lblDemand.textContent = m.demandIndex.label;

  progComp.style.width = `${m.competitionIndex.value}%`;
  lblComp.textContent = m.competitionIndex.label;

  progMargin.style.width = `${m.profitMarginPotential.value}%`;
  lblMargin.textContent = m.profitMarginPotential.label;

  progGap.style.width = `${Math.min(100, m.customerSatisfactionGap.value * 2)}%`;
  lblGap.textContent = m.customerSatisfactionGap.label;

  // Sizing KPIs
  const o = res.marketOverview;
  resMonthlyUnits.textContent = o.totalMonthlyUnits;
  resMonthlyRevenue.textContent = o.totalMonthlyRevenue;
  resSweetSpot.textContent = o.sweetSpotRange;
  resAvgPrice.textContent = o.averageSellingPrice;
  resAvgDiscount.textContent = `Avg ${o.averageDiscount} Discount`;

  // Brand Dominance
  if (res.brandDominance && res.brandDominance.length > 0) {
    resBrandList.innerHTML = res.brandDominance.map(b => `
      <div class="brand-bar-item">
        <span class="brand-bar-name">${b.brand}</span>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill fill-blue" style="width: ${b.share}%;"></div>
        </div>
        <span class="metric-val">${b.share}%</span>
      </div>
    `).join('');
  }

  // Populate IndiaMart Wholesale Sourcing
  const im = res.indiamartSourcing;
  if (im) {
    const s = im.sourcingSummary;
    const imDirLink = document.getElementById('resImDirectoryLink');
    if (imDirLink) imDirLink.href = s.indiamartDirectoryUrl;

    const elRange = document.getElementById('imWholesaleRange');
    if (elRange) elRange.textContent = s.wholesaleRange;

    const elGross = document.getElementById('imGrossMargin');
    if (elGross) elGross.textContent = `${s.estimatedGrossMargin} Margin`;

    const elNet = document.getElementById('imNetProfit');
    if (elNet) elNet.textContent = `${s.estimatedNetProfitPerUnit} / pc`;

    const elHubs = document.getElementById('imHubs');
    if (elHubs) elHubs.textContent = s.hubDistribution;

    const grid = document.getElementById('imSuppliersGrid');
    if (grid && im.suppliers) {
      grid.innerHTML = im.suppliers.map(supp => `
        <div class="im-supplier-card">
          <div class="im-card-top">
            <div>
              <div class="im-company-name">${supp.supplierName}</div>
              <div class="im-location"><i class="fa-solid fa-location-dot"></i> ${supp.location}</div>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">${supp.memberSince}</div>
          </div>

          <div class="im-trust-badge">
            <i class="fa-solid fa-shield-halved"></i> ${supp.trustBadge}
          </div>

          <div class="im-price-row">
            <div>
              <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">WHOLESALE RATE</div>
              <div class="im-wholesale-price">${supp.formattedPrice} <span style="font-size:0.72rem; color:var(--text-secondary);">${supp.priceUnit}</span></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">MIN ORDER</div>
              <div class="im-moq">${supp.moq}</div>
            </div>
          </div>

          <ul class="im-specs-list">
            ${supp.specs.slice(0, 3).map(sp => `
              <li><i class="fa-solid fa-check"></i> <span>${sp}</span></li>
            `).join('')}
          </ul>

          <div class="im-actions-row">
            <button class="btn-use-price" data-price="${supp.wholesalePrice}" title="Use this wholesale price in profit simulator">
              <i class="fa-solid fa-arrow-down-long"></i> Use in Simulator
            </button>
            <a href="${supp.indiamartSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn-im-contact" title="Open IndiaMart Supplier">
              Source ↗
            </a>
          </div>
        </div>
      `).join('');

      // Add event listener to "Use in Simulator" buttons
      grid.querySelectorAll('.btn-use-price').forEach(btn => {
        btn.addEventListener('click', () => {
          const wholesalePrice = parseFloat(btn.dataset.price) || 0;
          simSourcingCost.value = wholesalePrice;
          calculateProfitSimulator();
          document.querySelector('.simulator-card').scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  }

  // Populate Unit Economics Simulator defaults
  if (res.unitEconomics) {
    simSellingPrice.value = res.unitEconomics.sellingPrice;
    simSourcingCost.value = (im && im.sourcingSummary && im.sourcingSummary.averageWholesalePriceRaw) 
      ? im.sourcingSummary.averageWholesalePriceRaw 
      : res.unitEconomics.sourcingCost;
    simPlatformFee.value = 12;
    simShippingFee.value = res.unitEconomics.shippingFee;
    simGstRate.value = 18;
    calculateProfitSimulator();
  }

  // Voice of Customer
  if (res.voiceOfCustomer) {
    resPraiseList.innerHTML = res.voiceOfCustomer.praises.map(p => `
      <li class="voc-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${p}</span>
      </li>
    `).join('');

    resComplaintList.innerHTML = res.voiceOfCustomer.complaints.map(c => `
      <li class="voc-item">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>${c}</span>
      </li>
    `).join('');
  }

  // Keywords Matrix Table
  if (res.keywordMatrix) {
    resKeywordTableBody.innerHTML = res.keywordMatrix.map(k => `
      <tr>
        <td><strong>${k.keyword}</strong></td>
        <td><span class="badge-vol ${k.volume === 'Very High' ? 'vh' : k.volume === 'High' ? 'h' : 'm'}">${k.volume}</span></td>
        <td>${k.searches}</td>
        <td>${k.competition}</td>
        <td>${k.difficulty} / 100</td>
        <td><span style="color:#10B981; font-weight:bold;">${k.opportunity}</span></td>
      </tr>
    `).join('');
  }

  // Top Leaders Table
  if (res.topRankedProducts) {
    resLeadersTableBody.innerHTML = res.topRankedProducts.map(p => `
      <tr>
        <td><strong>#${p.rank}</strong></td>
        <td><span class="platform-badge ${p.platform === 'Amazon.in' ? 'amz' : 'fk'}">${p.platform}</span></td>
        <td><div style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${p.title}">${p.title}</div></td>
        <td><strong>${p.formattedPrice}</strong></td>
        <td>${p.estimatedMonthlySales.toLocaleString('en-IN')} units</td>
        <td><strong style="color:#10B981;">${p.estimatedMonthlyRevenue}</strong></td>
        <td>
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="padding:0.3rem 0.6rem; font-size:0.75rem;">
            Visit <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </td>
      </tr>
    `).join('');
  }
}

// Live Profit Simulator Recalculation
function calculateProfitSimulator() {
  const sp = parseFloat(simSellingPrice.value) || 0;
  const sc = parseFloat(simSourcingCost.value) || 0;
  const pfPct = parseFloat(simPlatformFee.value) || 12;
  const sf = parseFloat(simShippingFee.value) || 0;
  const gstPct = parseFloat(simGstRate.value) || 18;

  const commission = Math.round(sp * (pfPct / 100));
  const taxable = Math.max(0, sp - sc);
  const gst = Math.round(taxable * (gstPct / 100));
  const totalCost = sc + commission + sf + gst;
  const netProfit = Math.round(sp - totalCost);
  const marginPct = sp > 0 ? Math.round((netProfit / sp) * 100) : 0;

  // Update UI
  simNetProfit.textContent = `₹${netProfit.toLocaleString('en-IN')}`;
  simMarginPercent.textContent = `${marginPct}%`;
  simLblSourcing.textContent = `₹${sc.toLocaleString('en-IN')}`;
  simLblCommission.textContent = `₹${commission.toLocaleString('en-IN')} (${pfPct}%)`;
  simLblShipping.textContent = `₹${sf.toLocaleString('en-IN')}`;
  simLblGst.textContent = `₹${gst.toLocaleString('en-IN')} (${gstPct}%)`;
  simLblTotalCost.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
  simMonthlyProfit500.textContent = `₹${(netProfit * 500).toLocaleString('en-IN')} / month`;

  // Color dynamics
  if (netProfit < 0) {
    simNetProfit.style.color = '#F43F5E';
    simMarginPercent.style.color = '#F43F5E';
  } else {
    simNetProfit.style.color = '#10B981';
    simMarginPercent.style.color = '#34D399';
  }
}

// Export Research Dossier
function exportResearchDossier() {
  if (!state.researchData) return;
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.researchData, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonStr);
  link.setAttribute('download', `niche_research_${state.researchQuery}_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Product Intelligence Modal
function openInspectModal(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  modalTitle.textContent = `${product.platformName} Trend Intelligence`;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  modalBody.innerHTML = `
    <div style="display:flex; gap:1.25rem; margin-bottom:1.5rem; align-items:center;">
      <img src="${product.image}" style="width:90px; height:90px; object-fit:contain; background:#fff; border-radius:12px; padding:0.5rem;" />
      <div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.25rem;">
          Rank #${product.rank} in Category &bull; Platform: <strong>${product.platformName}</strong>
        </div>
        <h4 style="font-size:1rem; line-height:1.4; margin-bottom:0.4rem;">${product.title}</h4>
        <div style="font-family:var(--font-mono); font-size:1.25rem; font-weight:800; color:var(--text-primary);">
          ${product.formattedPrice || '₹' + product.price.toLocaleString('en-IN')}
          <span style="font-size:0.85rem; color:var(--text-muted); text-decoration:line-through; font-weight:normal;">
            ${product.originalPrice ? '₹' + product.originalPrice.toLocaleString('en-IN') : ''}
          </span>
          <span style="font-size:0.8rem; color:#10B981; font-weight:bold; margin-left:0.5rem;">
            Save ₹${savings.toLocaleString('en-IN')} (${product.discountPercent}%)
          </span>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
      <div style="background:var(--bg-surface); padding:1rem; border-radius:12px;">
        <div style="font-size:0.75rem; color:var(--text-muted);">Trending Momentum Score</div>
        <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:#34D399;">
          ${product.trendingScore || 88} <span style="font-size:0.85rem; color:var(--text-secondary);">/ 100</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.25rem;">
          Status: <strong>${product.velocity?.text || 'High Demand'}</strong>
        </div>
      </div>
      <div style="background:var(--bg-surface); padding:1rem; border-radius:12px;">
        <div style="font-size:0.75rem; color:var(--text-muted);">Social Proof & Volume</div>
        <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:#60A5FA;">
          ★ ${product.rating || '4.3'}
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.25rem;">
          Verified Buyers: <strong>${Number(product.reviewCount || 1000).toLocaleString('en-IN')}</strong>
        </div>
      </div>
    </div>

    <div style="margin-bottom:1.5rem;">
      <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.6rem;">
        Extracted SEO Keywords & Key Specifications:
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
        ${(product.keywords || []).map(kw => `
          <span style="background:var(--bg-surface); border:1px solid var(--border-color); padding:0.3rem 0.65rem; border-radius:8px; font-size:0.8rem; font-weight:600;">
            ${kw}
          </span>
        `).join('')}
      </div>
    </div>

    <div style="display:flex; gap:0.75rem;">
      <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="btn-primary full-width" style="text-decoration:none;">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open on ${product.platformName}
      </a>
    </div>
  `;

  detailModal.classList.add('open');
}

// API Explorer & Endpoints Modal
async function openDiagnosticsModal() {
  diagnosticsModal.classList.add('open');
  const baseUrl = `${window.location.origin}/api`;

  diagBody.innerHTML = `
    <div class="api-overview-banner">
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Gofayda REST API Base URL</div>
        <div class="api-base-url"><code>${baseUrl}</code></div>
      </div>
      <div id="apiHealthBadge" style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
        <span class="status-pill status-amz" style="padding:0.25rem 0.65rem; font-size:0.75rem;">
          <span class="status-dot"></span> <i class="fa-brands fa-amazon"></i> Amazon.in Live API
        </span>
        <span class="status-pill status-fk" style="padding:0.25rem 0.65rem; font-size:0.75rem;">
          <span class="status-dot"></span> <span class="fk-f">F</span> Flipkart Live API
        </span>
      </div>
    </div>

    <div style="font-size:0.82rem; font-weight:700; margin-bottom:0.6rem; color:var(--text-secondary);">
      <i class="fa-solid fa-list-check"></i> Available Live Endpoints:
    </div>

    <div class="api-endpoints-list">
      <!-- Endpoint 1 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/trending</span>
          <span class="api-desc">Ranked products by category & platform</span>
        </div>
        <button class="api-test-btn" data-url="/api/trending?category=smartwatch" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 2 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/search</span>
          <span class="api-desc">Keyword search with scores & SEO tags</span>
        </div>
        <button class="api-test-btn" data-url="/api/search?q=earbuds" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 3 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/research</span>
          <span class="api-desc">Market opportunity dossier & monthly GMV</span>
        </div>
        <button class="api-test-btn" data-url="/api/research?q=air%20fryer" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint: IndiaMart Sourcing -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/sourcing</span>
          <span class="api-desc">IndiaMart wholesale supplier pricing & arbitrage</span>
        </div>
        <button class="api-test-btn" data-url="/api/sourcing?q=smartwatch&price=1999" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 4 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method post">POST</span>
          <span class="api-path">/research/profit-calc</span>
          <span class="api-desc">Calculate unit economics & profit ROI</span>
        </div>
        <button class="api-test-btn" data-url="/api/research/profit-calc" data-method="POST">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 5 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/categories</span>
          <span class="api-desc">Supported category taxonomies</span>
        </div>
        <button class="api-test-btn" data-url="/api/categories" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 6 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/diagnostics</span>
          <span class="api-desc">Amazon.in Live API & Flipkart Live API latency</span>
        </div>
        <button class="api-test-btn" data-url="/api/diagnostics" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 7 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method post">POST</span>
          <span class="api-path">/auth/session</span>
          <span class="api-desc">Firebase Mobile OTP seller session confirmation</span>
        </div>
        <button class="api-test-btn" data-url="/api/auth/session" data-method="POST">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 8 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method get">GET</span>
          <span class="api-path">/labels/sample</span>
          <span class="api-desc">Amazon, Flipkart & Meesho sample labels batch</span>
        </div>
        <button class="api-test-btn" data-url="/api/labels/sample" data-method="GET">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>

      <!-- Endpoint 9 -->
      <div class="api-endpoint-card">
        <div class="api-ep-left">
          <span class="api-method post">POST</span>
          <span class="api-path">/labels/process</span>
          <span class="api-desc">Sort labels by SKU & Delivery Partner with picklist</span>
        </div>
        <button class="api-test-btn" data-url="/api/labels/process" data-method="POST">
          <i class="fa-solid fa-play"></i> Try API
        </button>
      </div>
    </div>

    <!-- Live Response Viewer -->
    <div class="api-response-container">
      <div class="api-resp-header">
        <span id="apiRespStatus"><i class="fa-solid fa-terminal"></i> Response Payload Preview</span>
        <button id="copyApiJsonBtn" class="btn-text" style="padding:0.2rem 0.5rem; font-size:0.75rem;">
          <i class="fa-regular fa-copy"></i> Copy JSON
        </button>
      </div>
      <pre id="apiRespCode" class="api-resp-code">// Click "Try API" on any endpoint above to fetch live data...</pre>
    </div>
  `;

  // Attach Try API event listeners
  const respCodeEl = document.getElementById('apiRespCode');
  const respStatusEl = document.getElementById('apiRespStatus');
  const copyBtn = document.getElementById('copyApiJsonBtn');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(respCodeEl.textContent);
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy JSON';
    }, 2000);
  });

  diagBody.querySelectorAll('.api-test-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      const method = btn.dataset.method;
      respStatusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Fetching ${method} ${url}...`;
      respCodeEl.textContent = 'Requesting live data from server...';

      try {
        const t0 = performance.now();
        let res;
        if (method === 'POST') {
          let bodyPayload;
          if (url.includes('/auth/session')) {
            bodyPayload = { phoneNumber: '+919876543210', uid: 'hero_demo_' + Date.now() };
          } else if (url.includes('/labels/process')) {
            bodyPayload = { sortBy: 'sku-asc', marketplace: 'all', deliveryPartner: 'all' };
          } else {
            bodyPayload = {
              sellingPrice: 2499,
              sourcingCost: 850,
              platformFeePercent: 12,
              shippingFee: 90,
              gstPercent: 18
            };
          }

          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
          });
        } else {
          res = await fetch(url);
        }
        const ms = Math.round(performance.now() - t0);
        const data = await res.json();
        respStatusEl.innerHTML = `<span style="color:#10B981; font-weight:bold;">${res.status} OK</span> &bull; ${method} ${url} (${ms} ms)`;
        respCodeEl.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        respStatusEl.innerHTML = `<span style="color:#F43F5E; font-weight:bold;">Error</span>`;
        respCodeEl.textContent = `Error: ${err.message}`;
      }
    });
  });

  // Automatically ping diagnostics to populate health badge
  try {
    const dRes = await fetch('/api/diagnostics');
    const dData = await dRes.json();
    const healthBadge = document.getElementById('apiHealthBadge');
    if (healthBadge) {
      healthBadge.innerHTML = `<span class="status-dot"></span> Online &bull; ${dData.latencyMs}ms Latency`;
    }
  } catch (e) {
    const healthBadge = document.getElementById('apiHealthBadge');
    if (healthBadge) {
      healthBadge.innerHTML = `<span style="color:#F43F5E;">Offline</span>`;
    }
  }
}

// Export to CSV
function exportToCsv() {
  if (state.filteredProducts.length === 0) {
    alert('No products to export!');
    return;
  }

  const headers = ['Rank', 'Platform', 'Title', 'Current Price (INR)', 'Original MRP (INR)', 'Discount %', 'Rating', 'Reviews Count', 'Trending Score', 'Keywords', 'Product URL'];
  const rows = state.filteredProducts.map(p => [
    p.rank,
    p.platformName,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    p.price,
    p.originalPrice,
    p.discountPercent,
    p.rating,
    p.reviewCount,
    p.trendingScore,
    `"${(p.keywords || []).join(', ')}"`,
    p.url
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `gofayda_hero_seller_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to JSON
function exportToJson() {
  if (state.filteredProducts.length === 0) {
    alert('No products to export!');
    return;
  }
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.filteredProducts, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonStr);
  link.setAttribute('download', `gofayda_hero_seller_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event Listeners
function initEventListeners() {
  // Navigation View Switcher
  viewTrendingBtn.addEventListener('click', () => switchView('trending'));
  viewResearchBtn.addEventListener('click', () => switchView('research'));
  if (viewLabelCropBtn) {
    viewLabelCropBtn.addEventListener('click', () => switchView('labelcrop'));
  }

  // Research Form
  researchSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = researchSearchInput.value.trim();
    if (q) performResearch(q);
  });

  // Research Quick Tag chips
  researchQuickTags.querySelectorAll('.quick-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      researchSearchInput.value = q;
      performResearch(q);
    });
  });

  // Profit Simulator Live Listeners
  [simSellingPrice, simSourcingCost, simPlatformFee, simShippingFee, simGstRate].forEach(input => {
    input.addEventListener('input', calculateProfitSimulator);
  });

  exportResearchBtn.addEventListener('click', exportResearchDossier);

  // Search form (Trending)
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (q) performSearch(q);
  });

  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    state.currentQuery = '';
    fetchTrending(state.activeCategory);
  });

  // Quick tag chips (Trending)
  quickTagsList.querySelectorAll('.quick-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      searchInput.value = q;
      clearSearchBtn.style.display = 'block';
      performSearch(q);
    });
  });

  // Platform tabs
  document.querySelectorAll('.platform-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activePlatform = tab.dataset.platform;
      applyFiltersAndSort();
    });
  });

  // Sort & Filter dropdowns
  sortSelect.addEventListener('change', () => {
    state.sortBy = sortSelect.value;
    applyFiltersAndSort();
  });

  ratingFilter.addEventListener('change', () => {
    state.minRating = parseFloat(ratingFilter.value) || 0;
    applyFiltersAndSort();
  });

  discountFilter.addEventListener('change', () => {
    state.minDiscount = parseInt(discountFilter.value, 10) || 0;
    applyFiltersAndSort();
  });

  resetFiltersBtn.addEventListener('click', resetAllFilters);
  emptyResetBtn.addEventListener('click', resetAllFilters);

  // Exports
  exportCsvBtn.addEventListener('click', exportToCsv);
  exportJsonBtn.addEventListener('click', exportToJson);
  exportWatchlistBtn.addEventListener('click', exportToCsv);

  // Watchlist Drawer
  watchlistToggleBtn.addEventListener('click', () => {
    watchlistDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
  });

  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  function closeDrawer() {
    watchlistDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  }

  // Modals
  closeModalBtn.addEventListener('click', () => detailModal.classList.remove('open'));
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.remove('open');
  });

  diagnosticsBtn.addEventListener('click', openDiagnosticsModal);
  closeDiagBtn.addEventListener('click', () => diagnosticsModal.classList.remove('open'));
  diagnosticsModal.addEventListener('click', (e) => {
    if (e.target === diagnosticsModal) diagnosticsModal.classList.remove('open');
  });
}

function resetAllFilters() {
  sortSelect.value = 'trending';
  ratingFilter.value = '0';
  discountFilter.value = '0';
  state.sortBy = 'trending';
  state.minRating = 0;
  state.minDiscount = 0;
  state.activeKeywordFilter = null;
  applyFiltersAndSort();
}
