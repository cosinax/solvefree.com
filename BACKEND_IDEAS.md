# Backend-Required Tools — Brainstorm

These are tools that would require a server-side component, external API calls, or real-time data that can't be done purely in the browser. Not implementing yet — planning only.

---

## 🌐 Live Data / APIs

### Currency Converter (Live Rates)
- Fetch live exchange rates from an API (e.g. Open Exchange Rates, Fixer.io, exchangeratesapi.io)
- Current implementation uses hardcoded approximations — live rates would be far more useful
- Could cache rates server-side every 15 minutes

### Cryptocurrency Price Calculator
- Live BTC/ETH/SOL prices from Coingecko or CoinMarketCap API
- Portfolio value tracker with historical cost basis
- Requires API key and server-side fetching

### Stock Quote & Return Calculator
- Fetch real-time or EOD stock prices
- Calculate holding period returns, CAGR, dividends
- Requires finance data API (Yahoo Finance, Alpha Vantage, Polygon.io)

### Gas Price by Location
- Pull current average gas prices by ZIP code or state
- Uses GasBuddy / EIA API
- Requires location permission + backend proxy

---

## 🔐 Cryptographic Operations (require server for security or computation)

### SSL Certificate Checker
- Check if a domain's TLS certificate is valid, expiry date, issuer, cipher
- Must be done server-side (HTTPS handshake from the server)
- Endpoint: `GET /api/ssl-check?domain=example.com`

### WHOIS / Domain Lookup
- Look up domain registration info, nameservers, creation/expiry dates
- Requires WHOIS query or RDAP API from server

### DNS Lookup Tool
- Query A, AAAA, MX, TXT, CNAME, NS, SOA records for a domain
- Uses `dns.resolve()` on server or public DNS-over-HTTPS (DoH) API like 1.1.1.1
- Could partially be done via DoH fetch from browser

### IP Geolocation
- Given an IP address, return country, city, ISP, ASN, lat/lon
- Requires MaxMind GeoIP database or ip-api.com
- Server-side to avoid exposing API key

### DMARC / SPF / DKIM Checker
- Validate email authentication records for a domain
- DNS queries for TXT records — server-side

---

## 📊 Heavy Computation / Datasets

### Mortgage Amortization Export (PDF)
- Generate downloadable PDF of full amortization schedule
- Requires server-side PDF generation (e.g. Puppeteer, react-pdf)

### Tax Calculator (US Federal + State)
- Calculate estimated federal and state income tax
- Requires up-to-date tax bracket tables by year/state
- Complex enough to warrant server-side validation and updates
- Would need annual maintenance

### Retirement Account Tax Comparison (Traditional vs Roth)
- Requires future tax rate assumptions and complex projections
- Could be client-side but benefits from server-validated bracket data

### Historical Inflation Lookup (CPI)
- Query specific CPI data from BLS (Bureau of Labor Statistics)
- More accurate than the simple approximation currently used
- Requires BLS API key

---

## 🤖 AI / LLM-Powered Tools

### Smart Unit Converter (Natural Language)
- "Convert 3 cups of flour to grams" (requires density lookup)
- Uses LLM to parse ambiguous inputs or unusual units
- Server-side LLM API call

### Recipe Nutrition Analyzer
- Paste recipe → get nutrition info (calories, macros per serving)
- Requires USDA FoodData Central API + LLM for parsing
- Server-side

### Smart Budget Planner
- AI-generated budget breakdown from income and goals
- Server-side LLM

### Formula Explainer
- Enter any formula → get plain-English explanation + worked example
- Server-side LLM

---

## 🔎 Real-Time Utilities

### Website Speed / Performance Check
- Measure load time, TTFB, render time from server perspective
- Can't be done from client (cross-origin restrictions)
- Server fetches the URL and measures timing

### Ping / Traceroute Visualizer
- Run actual network diagnostics from server location
- Requires server-side ICMP or TCP ping
- Could show route hops on a world map

### Header Inspector
- Fetch HTTP response headers for any URL
- Must be done server-side to avoid CORS

### URL Redirect Follower
- Follow redirect chain and show each hop with status code
- Server-side HTTP client with redirect tracking

### Screenshot Generator
- Take a screenshot of any URL
- Requires Puppeteer/Playwright on server

---

## 📧 Communication / Social

### Email SPF/DKIM/DMARC Validator
- Server-side DNS queries for email security records
- Full email deliverability audit

### QR Code Generator (Dynamic)
- Static QR: can be done client-side (already possible)
- Dynamic QR (short URLs with tracking) requires backend

---

## 📍 Location-Based

### Sunrise/Sunset Times
- Could be client-side with the user's coordinates (no backend needed!)
- But IP-based location requires server-side geolocation

### Timezone from GPS / Address
- Reverse geocode address to timezone
- Requires Google Maps / Nominatim API

### Distance Calculator Between Two Cities
- Could use client-side haversine with lat/lon lookup
- Lat/lon lookup requires geocoding API (server-side to protect key)

---

## 🏠 Home / Property

### Mortgage Rate Lookup (Live)
- Current 30yr/15yr fixed rates from lenders or Freddie Mac API
- Server-side data fetch + caching

### Property Tax Estimator
- Look up property tax rates by ZIP code
- Requires property tax database

### Cost of Living Comparison
- Compare cost of living between cities (housing, food, transport)
- Requires Numbeo API or similar dataset — server-side to protect key

---

## Notes on Architecture

For most of these, the pattern would be:
1. Next.js API route (`/api/...`) or Server Action
2. Rate limiting + caching to avoid hammering external APIs
3. API keys stored in environment variables (never exposed to client)
4. Edge caching where possible (Vercel Edge Cache, Cloudflare KV)

Priority order for implementation:
1. **SSL Certificate Checker** — high utility, clear implementation
2. **DNS Lookup Tool** — extremely useful for devs, DoH is straightforward
3. **Live Currency Rates** — upgrade to the existing currency converter
4. **IP Geolocation** — simple API call, very useful
5. **HTTP Header Inspector** — dev tool, fits the existing computer category
6. **Website Speed Check** — impressive tool, good for devs
