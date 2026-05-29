# Polar Payment Gateway - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies ✅
Already installed: `@polar-sh/sdk` and `@polar-sh/nextjs`

### 2. Get Polar Credentials

**Sandbox (Testing):**
1. Go to [https://sandbox.polar.sh](https://sandbox.polar.sh)
2. Sign up / Login
3. Create an organization
4. Go to Settings → Developers → Access Tokens
5. Create token → Copy it (starts with `polar_at_`)

**Create a Product:**
1. Go to Products → Create Product
2. Fill in details (name, price, description)
3. Copy the Product ID (starts with `prod_`)

**Setup Webhook:**
1. Go to Settings → Webhooks → Add Endpoint
2. URL: `http://localhost:3000/api/polar/webhook` (use ngrok for testing)
3. Select events: `checkout.*`, `order.*`
4. Generate secret → Copy it

### 3. Update .env.local

```env
POLAR_ACCESS_TOKEN=polar_at_your_token_here
POLAR_WEBHOOK_SECRET=your_webhook_secret_here
POLAR_SERVER=sandbox
```

### 4. Run Database Migration

```bash
# Using psql
psql -U your_username -d your_database -f add-polar-settings.sql

# Or copy/paste into Supabase SQL Editor
```

### 5. Enable in Admin Panel

1. Start your app: `npm run dev`
2. Go to `/admin`
3. Click **Settings** tab
4. Scroll to **Payment Methods**
5. ✅ Enable Polar
6. Paste your Product ID
7. Click **Save Settings**

### 6. Test It!

1. Add items to cart
2. Go to checkout
3. Select **Polar** payment method
4. Enter email and name
5. Click **Continue to Polar Checkout**
6. Complete payment on Polar's page
7. Get redirected back to success page

## 📁 Files Created

```
lib/polar.ts                      # Polar API client
app/api/polar/checkout/route.ts  # Checkout session creation
app/api/polar/webhook/route.ts   # Webhook handler
add-polar-settings.sql            # Database migration
POLAR-SETUP.md                    # Full documentation
```

## 🔧 Integration Points

### Checkout Page
- Added Polar payment option button
- Added customer info form (email, name)
- Added checkout handler function
- Redirects to Polar hosted checkout

### Admin Panel
- Added Polar enable/disable toggle
- Added Product ID configuration field
- Added setup instructions

### API Routes
- `/api/polar/checkout` - Creates checkout sessions
- `/api/polar/webhook` - Receives payment events

### Database
- `payment_polar_enabled` - Enable/disable flag
- `polar_product_id` - Product ID from Polar
- `polar_order_id` - Links Polar orders to your orders

## 🧪 Testing with ngrok

For local webhook testing:

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update webhook URL in Polar dashboard:
# https://abc123.ngrok-free.app/api/polar/webhook
```

## 🌐 Going to Production

1. Create production Polar account at [https://polar.sh](https://polar.sh)
2. Complete business verification
3. Create production products
4. Get production API token
5. Update `.env.local`:
   ```env
   POLAR_SERVER=production
   POLAR_ACCESS_TOKEN=polar_at_production_token
   POLAR_WEBHOOK_SECRET=production_webhook_secret
   ```
6. Update webhook URL to your production domain
7. Test with a small real transaction

## 💡 Key Features

✅ **Hosted Checkout** - Polar handles the payment UI
✅ **Global Payments** - Credit cards, digital wallets
✅ **Tax Compliance** - Automatic VAT/GST/sales tax
✅ **Merchant of Record** - Polar is the legal seller
✅ **Webhook Events** - Real-time order updates
✅ **Multiple Currencies** - Auto-detected by customer location
✅ **Subscriptions** - Built-in support (use recurring products)

## 🆘 Troubleshooting

**Checkout fails:**
- Check `POLAR_ACCESS_TOKEN` is correct
- Verify Product ID exists in Polar dashboard
- Check console for error messages

**Webhooks not working:**
- Use ngrok for local testing
- Verify `POLAR_WEBHOOK_SECRET` matches
- Check Polar dashboard webhook logs

**Orders not updating:**
- Check webhook events are received (server logs)
- Verify database migration ran successfully
- Check Supabase connection

## 📚 Resources

- [Full Setup Guide](./POLAR-SETUP.md)
- [Polar Documentation](https://polar.sh/docs)
- [Polar API Reference](https://docs.polar.sh/api-reference)
- [Polar Discord](https://discord.gg/polar)

## 🎯 Next Steps

1. ✅ Complete setup above
2. Test in sandbox environment
3. Create production account
4. Switch to production mode
5. Process real payments!

---

**Need help?** Check [POLAR-SETUP.md](./POLAR-SETUP.md) for detailed documentation.
