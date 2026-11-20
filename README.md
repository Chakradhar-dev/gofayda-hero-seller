# Gofayda Hero Seller 🇮🇳
### Top Trending Products Tracker & Product Research Hub for Amazon.in & Flipkart

**Gofayda Hero Seller** is a real-time e-commerce intelligence web application designed to find and rank top trending products, discover high-velocity keywords, and perform deep product and niche research across India's two leading e-commerce platforms: **Amazon.in** and **Flipkart**.

---

## 🌟 Key Features

### 1. 🔥 Trending Explorer (Live Product Rankings)
- **Dual Platform Coverage**: Side-by-side or individual rankings from **Amazon.in** and **Flipkart**.
- **Product Rank**: Sales rank and search position ordering (**#1 to #50**).
- **Composite Trending Score (0–100)**: Multi-factor algorithm weighing rank position, customer star rating (out of 5.0★), review volume velocity, discount margin, and platform badges (*Prime*, *Amazon's Choice*, *Flipkart Assured*).
- **Velocity Tags**: Classifies products as *Breakout Trend* (🚀), *Viral Demand* (🔥), *High Velocity* (⚡), or *Steady Seller* (📈).
- **Semantic Keyword & SEO Extraction**: Extracts technical specs (`AMOLED`, `Active Noise Cancellation`, `Fast Charging`, `Dolby Vision`, `IP68`, `Snapdragon`) with an interactive **Keyword Cloud**.
- **Price Intelligence**: Current price, crossed-out MRP, discount percentage (`% OFF`), and total rupee savings.
- **Sorting & Filters**: Sort by Trending Score, Rank, Price, Discount, Rating, and Review Count. Filter by rating and discount.
- **Saved Watchlist & Export**: Bookmark products with basket total calculator, and export to **CSV** or **JSON**.

---

### 2. 🔬 Deep Product Research Hub (New!)
A dedicated research mode tailored for sellers, market analysts, and smart shoppers to evaluate market viability:
- **Market Opportunity Scorecard (1.0 to 10.0)**:
  - Composite Opportunity Verdict (*High Opportunity*, *Moderate Potential*, *Highly Saturated*).
  - Multi-variable gauges for **Market Demand Velocity**, **Competition Density**, **Margin Potential**, and **Customer Satisfaction Gap**.
- **Estimated Market Sizing & GMV**:
  - **Estimated Monthly Volume**: Predicts units sold per month based on category BSR / rank velocity curves.
  - **Estimated Monthly Revenue (₹ Crores)**: Projects gross market size.
  - **Golden Price Sweet Spot**: Computes the optimal conversion price bracket (e.g. ₹1,499 - ₹2,999).
  - Average selling price and average market discount.
- **Brand Dominance & Monopoly Analysis**:
  - Market share percentage breakdown across leading brands in the niche (e.g. Fire-Boltt, Noise, boAt, Samsung).
- **Interactive Unit Economics & Profit Margin Simulator**:
  - Live adjustable inputs: Selling Price (₹), Sourcing Cost (₹), Marketplace Referral Fee (%), Shipping Fee (₹), and GST Rate (%).
  - Real-time calculations: Total Unit Cost, **Net Profit per Unit (₹)**, **Net Margin (%)**, **ROI (%)**, and Projected Monthly Earnings at 500 units.
- **Voice of Customer (Sentiment & Gap Analyzer)**:
  - 🌟 **Winning Features**: Key praise points extracted from 4★ & 5★ reviews.
  - ⚠️ **Market Gaps & Critical Complaints**: Common customer frustrations from 1★–3★ reviews (major product differentiation opportunity).
- **High-Converting Keywords & Search Demand Matrix**:
  - High-intent search terms with Search Volume Tiers (`Very High`, `High`, `Medium`), Competition Level, Keyword Difficulty, and Opportunity Rating.
- **Top 5 Market Leaders**:
  - Detailed table showing rank, platform, selling price, estimated monthly sales, and projected revenue.
- **One-Click Niche Pivot from Product Cards**:
  - Click the **🔬 Research** icon on any trending product card to immediately jump into deep market research for that product.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js (v18 or higher)
- npm

### 2. Run the Application
In the project directory (`C:\Users\91824\.gemini\antigravity\scratch\gofayda-hero-seller`):

```powershell
node server.js
# or
npm start
```

### 3. Open in Browser
Visit **[http://localhost:9000](http://localhost:9000)** in any web browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trending?category=:cat&platform=:plat` | Fetch trending products for a category (`smartwatch`, `earbuds`, `smartphones`, `laptops`, `kitchen`, `gaming`, `all`). |
| `GET` | `/api/search?q=:query&platform=:plat&sort=:sort` | Live search across Amazon.in and Flipkart with rankings and keyword extraction. |
| `GET` | `/api/research?q=:query&platform=:plat` | Deep market research dossier: opportunity score, monthly volume, GMV, sweet spot, brand dominance, voice of customer, and keyword matrix. |
| `POST` | `/api/research/profit-calc` | Interactive profit simulator: computes net profit, margin %, and ROI % given custom costs. |
| `GET` | `/api/categories` | List available categories with icons and sample queries. |
| `GET` | `/api/diagnostics` | Amazon.in Live API & Flipkart Live API connectivity and latency diagnostics. |

---

## 📁 Project Structure

```
gofayda-hero-seller/
├── public/
│   ├── index.html          # Dual-view dashboard (Trending Explorer & Product Research Hub)
│   ├── styles.css          # Responsive styling, gauges, progress bars, simulator layout
│   └── app.js              # State manager, view switcher, live profit simulator, exports
├── services/
│   ├── amazonScraper.js    # Amazon.in search and bestsellers scraping engine
│   ├── flipkartScraper.js  # Flipkart product, pricing, and rating parser
│   ├── trendEngine.js      # Trending score algorithm and keyword extraction
│   ├── researchEngine.js   # Market opportunity scoring, sales velocity, brand share, VOC
│   └── seedData.js         # Curated market intelligence seed data & dynamic query fallback
├── server.js               # Express API server with trending and research endpoints
├── package.json            # Dependencies & start scripts
└── README.md               # Complete documentation
```
