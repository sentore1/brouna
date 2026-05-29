# Polar Payment Gateway - Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Frontend   │      │   Backend    │      │   Database   │  │
│  │              │      │              │      │              │  │
│  │  Checkout    │─────▶│  API Routes  │─────▶│  Supabase    │  │
│  │  Page        │      │              │      │              │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                      │          │
│         │                      │                      │          │
└─────────┼──────────────────────┼──────────────────────┼──────────┘
          │                      │                      │
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Polar Platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Checkout   │      │   Webhooks   │      │   Dashboard  │  │
│  │   Hosted     │      │   Events     │      │   Admin      │  │
│  │   Page       │      │              │      │              │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 🔄 Payment Flow Diagram

```
Customer                Your App              Polar              Database
   │                       │                    │                   │
   │  1. Add to Cart       │                    │                   │
   ├──────────────────────▶│                    │                   │
   │                       │                    │                   │
   │  2. Go to Checkout    │                    │                   │
   ├──────────────────────▶│                    │                   │
   │                       │                    │                   │
   │  3. Select Polar      │                    │                   │
   ├──────────────────────▶│                    │                   │
   │                       │                    │                   │
   │  4. Enter Info        │                    │                   │
   ├──────────────────────▶│                    │                   │
   │                       │                    │                   │
   │                       │  5. Create Session │                   │
   │                       ├───────────────────▶│                   │
   │                       │                    │                   │
   │                       │  6. Checkout URL   │                   │
   │                       │◀───────────────────┤                   │
   │                       │                    │                   │
   │                       │  7. Save Order     │                   │
   │                       ├────────────────────┼──────────────────▶│
   │                       │                    │                   │
   │  8. Redirect          │                    │                   │
   │◀──────────────────────┤                    │                   │
   │                       │                    │                   │
   │  9. Complete Payment  │                    │                   │
   ├────────────────────────────────────────────▶│                   │
   │                       │                    │                   │
   │                       │  10. Webhook Event │                   │
   │                       │◀───────────────────┤                   │
   │                       │                    │                   │
   │                       │  11. Update Order  │                   │
   │                       ├────────────────────┼──────────────────▶│
   │                       │                    │                   │
   │  12. Redirect Back    │                    │                   │
   │◀──────────────────────────────────────────┤                   │
   │                       │                    │                   │
   │  13. Success Page     │                    │                   │
   ├──────────────────────▶│                    │                   │
   │                       │                    │                   │
```

## 📁 File Structure

```
your-app/
├── .env.local                          # Environment variables
│   ├── POLAR_ACCESS_TOKEN
│   ├── POLAR_WEBHOOK_SECRET
│   └── POLAR_SERVER
│
├── lib/
│   └── polar.ts                        # Polar API client
│
├── app/
│   ├── checkout/
│   │   └── page.tsx                    # Checkout page with Polar option
│   │
│   ├── admin/
│   │   └── page.tsx                    # Admin panel with Polar settings
│   │
│   └── api/
│       ├── polar/
│       │   ├── checkout/
│       │   │   └── route.ts            # Create checkout sessions
│       │   └── webhook/
│       │       └── route.ts            # Handle webhook events
│       │
│       └── settings/
│           └── route.ts                # Get/save Polar settings
│
├── add-polar-settings.sql              # Database migration
│
└── docs/
    ├── POLAR-README.md                 # Overview
    ├── POLAR-QUICK-START.md            # Quick setup
    ├── POLAR-SETUP.md                  # Complete guide
    ├── POLAR-CHECKLIST.md              # Verification checklist
    └── POLAR-INTEGRATION-SUMMARY.md    # Technical details
```

## 🔌 API Integration Points

### 1. Checkout Session Creation

```typescript
// app/api/polar/checkout/route.ts
POST /api/polar/checkout

Request:
{
  productId: "prod_xxx",
  amount: 99.99,
  currency: "USD",
  customerEmail: "customer@example.com",
  customerName: "John Doe",
  orderId: "ORDER_123"
}

Response:
{
  success: true,
  checkoutUrl: "https://polar.sh/checkout/...",
  checkoutId: "checkout_xxx"
}
```

### 2. Webhook Event Handler

```typescript
// app/api/polar/webhook/route.ts
POST /api/polar/webhook

Events Handled:
- checkout.created
- checkout.updated
- order.created
- subscription.created
- subscription.updated
- subscription.canceled
```

### 3. Settings API

```typescript
// app/api/settings/route.ts
GET /api/settings

Response:
{
  payment_polar_enabled: true,
  polar_product_id: "prod_xxx",
  // ... other settings
}
```

## 🗄️ Database Schema

```sql
-- Site Settings Table
site_settings
├── id (primary key)
├── payment_polar_enabled (boolean)
├── polar_product_id (text)
└── ... (other settings)

-- Orders Table
orders
├── id (primary key)
├── user_id (foreign key)
├── transaction_id (text)
├── polar_order_id (text) ← NEW
├── payment_method (text)
├── status (text)
├── total (numeric)
├── items (jsonb)
├── customer_name (text)
├── customer_email (text)
├── customer_phone (text)
├── shipping_address (text)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Index
CREATE INDEX idx_orders_polar_order_id ON orders(polar_order_id);
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. API Authentication                                        │
│     ├── POLAR_ACCESS_TOKEN in headers                        │
│     └── Server-side only (never exposed to client)           │
│                                                               │
│  2. Webhook Verification                                      │
│     ├── POLAR_WEBHOOK_SECRET for signature                   │
│     ├── Timestamp validation                                 │
│     └── Signature comparison                                 │
│                                                               │
│  3. HTTPS Enforcement                                         │
│     ├── All API calls over HTTPS                             │
│     └── Webhook endpoint requires HTTPS                      │
│                                                               │
│  4. Environment Variables                                     │
│     ├── Stored in .env.local                                 │
│     ├── Not committed to git                                 │
│     └── Server-side access only                              │
│                                                               │
│  5. Customer Data Protection                                  │
│     ├── No card data stored                                  │
│     ├── PCI compliance via Polar                             │
│     └── Minimal PII collection                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## 🌐 Multi-Currency Flow

```
Customer Location
      │
      ▼
IP Address Detection
      │
      ▼
Polar Auto-Detects
      │
      ├─── Currency
      ├─── Tax Rate
      └─── Payment Methods
      │
      ▼
Checkout Page
      │
      ├─── Shows Local Currency
      ├─── Calculates Tax
      └─── Displays Total
      │
      ▼
Payment Completion
      │
      ▼
Payout in Your Currency
```

## 📊 Data Flow

### Order Creation Flow

```
Cart Items
    │
    ▼
Calculate Total
    │
    ▼
Create Polar Session
    │
    ├─── Product ID
    ├─── Amount
    ├─── Currency
    ├─── Customer Info
    └─── Metadata
    │
    ▼
Save Order (Pending)
    │
    ├─── Order ID
    ├─── Transaction ID
    ├─── Items
    ├─── Customer Info
    └─── Status: "pending"
    │
    ▼
Redirect to Polar
```

### Webhook Update Flow

```
Polar Payment Complete
    │
    ▼
Send Webhook Event
    │
    ├─── Event Type
    ├─── Checkout ID
    ├─── Order ID
    └─── Signature
    │
    ▼
Verify Signature
    │
    ▼
Extract Order ID
    │
    ▼
Update Database
    │
    ├─── Status: "completed"
    ├─── Polar Order ID
    └─── Timestamp
    │
    ▼
Send Confirmation Email
```

## 🔄 State Management

```
Order States:
┌──────────┐
│ pending  │ ← Initial state when order created
└────┬─────┘
     │
     ▼
┌──────────┐
│processing│ ← Payment in progress at Polar
└────┬─────┘
     │
     ├─── Success ───▶ ┌───────────┐
     │                 │ completed │
     │                 └───────────┘
     │
     └─── Failure ───▶ ┌───────────┐
                       │  failed   │
                       └───────────┘
```

## 🎯 Integration Points Summary

| Component | Purpose | Technology |
|-----------|---------|------------|
| Frontend | Payment UI | React/Next.js |
| API Routes | Session creation | Next.js API |
| Webhooks | Event handling | Next.js API |
| Database | Order storage | Supabase/PostgreSQL |
| Polar SDK | API client | @polar-sh/sdk |
| Admin Panel | Configuration | React/Next.js |

## 📈 Scalability

```
Traffic Growth
      │
      ▼
┌─────────────────┐
│ Your App Scales │
│  (Vercel/etc)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Polar Handles:  │
│ - Payments      │
│ - Tax Calc      │
│ - Compliance    │
│ - Webhooks      │
└─────────────────┘
         │
         ▼
   No Bottleneck
```

## 🔧 Configuration Flow

```
Admin Panel
    │
    ▼
Enable Polar
    │
    ▼
Enter Product ID
    │
    ▼
Save to Database
    │
    ▼
Settings API
    │
    ▼
Frontend Reads Settings
    │
    ▼
Show Polar Option
    │
    ▼
Customer Can Pay
```

---

**This architecture provides:**
- ✅ Scalable payment processing
- ✅ Secure webhook handling
- ✅ Clean separation of concerns
- ✅ Easy maintenance
- ✅ Production-ready design
