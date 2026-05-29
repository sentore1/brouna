# 📊 SIZA ANALYTICS - SETUP GUIDE

## ✅ What's Included

### Analytics Features:
1. **Page Views Tracking** - Every page visit recorded
2. **Click Tracking** - Product clicks, buttons, links
3. **User Sessions** - Track user journey across pages
4. **Traffic Sources** - Where visitors come from
5. **Device Analytics** - Desktop, mobile, tablet breakdown
6. **Browser Analytics** - Chrome, Firefox, Safari, etc.
7. **Top Pages** - Most visited pages
8. **Product Clicks** - Most clicked products

## 🚀 Setup Steps

### Step 1: Run Database Migration
In Supabase SQL Editor, run:
```sql
-- Copy and paste from create-analytics-tables.sql
```

This creates 3 tables:
- `page_views` - All page visits
- `click_events` - All clicks
- `user_sessions` - User sessions

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: View Analytics
1. Go to `http://localhost:3000/admin`
2. Click **Analytics** tab
3. View real-time data

## 📊 Analytics Dashboard

### Overview Cards:
- **Total Views** - All page views
- **Total Clicks** - All click events
- **Sessions** - Unique user sessions
- **Avg Pages/Session** - Engagement metric

### Charts & Tables:
- **Top Pages** - Most visited pages
- **Traffic Sources** - Referrers (Google, Facebook, Direct, etc.)
- **Devices** - Desktop vs Mobile vs Tablet
- **Top Product Clicks** - Most clicked products
- **Recent Activity** - Live feed of page views

### Time Filters:
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days

## 🎯 What Gets Tracked

### Automatic Tracking:
✅ Every page view
✅ Page title
✅ Referrer (where they came from)
✅ Device type (desktop/mobile/tablet)
✅ Browser (Chrome/Firefox/Safari)
✅ User session (tracks journey)
✅ Product clicks
✅ Button clicks
✅ Link clicks

### Data Collected:
- Page URL
- Timestamp
- User agent
- IP address (for analytics only)
- Session ID
- Element clicked
- Product ID (for product clicks)

## 📈 Use Cases

### 1. Track Popular Products
See which products get the most clicks → Stock more

### 2. Optimize Pages
See which pages have high bounce rates → Improve content

### 3. Traffic Sources
See where visitors come from → Focus marketing

### 4. Device Optimization
See mobile vs desktop usage → Optimize for primary device

### 5. User Journey
See how users navigate → Improve UX

## 🔍 Example Queries

### Most Viewed Products:
Check "Top Product Clicks" in Analytics tab

### Traffic Sources:
Check "Traffic Sources" section

### Peak Hours:
Check "Recent Activity" timestamps

### Device Breakdown:
Check "Devices" section

## 🎨 Analytics API

### Track Custom Events:
```javascript
import { trackClick } from '@/components/AnalyticsTracker'

// Track custom click
trackClick({
  elementType: 'custom-button',
  elementText: 'Subscribe',
  productId: 'optional-product-id'
})
```

### Get Analytics Data:
```javascript
// Fetch last 7 days
const res = await fetch('/api/analytics?days=7')
const data = await res.json()

console.log(data.pageViews)
console.log(data.clicks)
console.log(data.sessions)
```

## 📊 Sample Analytics View

```
Total Views: 1,234
Total Clicks: 567
Sessions: 345
Avg Pages/Session: 3.6

Top Pages:
1. /products/silk-dress - 234 views
2. / - 189 views
3. /products - 156 views

Traffic Sources:
1. Google - 145 visits
2. Direct - 98 visits
3. Facebook - 67 visits

Devices:
Desktop: 678 (55%)
Mobile: 456 (37%)
Tablet: 100 (8%)

Top Product Clicks:
1. silk-dress - 89 clicks
2. cashmere-sweater - 67 clicks
3. leather-bag - 54 clicks
```

## 🔒 Privacy

- No personal data collected
- IP addresses for analytics only
- Session IDs are random
- GDPR compliant
- No cookies required

## 🎯 Next Steps

1. ✅ Run database migration
2. ✅ Visit website pages to generate data
3. ✅ Check `/admin` → Analytics tab
4. 📊 Monitor daily
5. 📈 Optimize based on data

---

**Your analytics are now live! 📊**

Every visitor, click, and session is tracked automatically.
