# Polar Payment Gateway Integration Guide

This guide will help you set up Polar payment gateway in your e-commerce application.

## What is Polar?

Polar is a merchant-of-record payment platform designed for developers. It handles:
- Payment processing (credit cards, digital wallets)
- Global tax compliance (VAT, GST, sales tax)
- Subscription management
- Digital product delivery
- Automated invoicing

## Prerequisites

1. A Polar account ([Sign up here](https://polar.sh))
2. At least one product created in your Polar dashboard
3. Access to your database to run migrations

## Setup Steps

### 1. Create a Polar Account

1. Go to [https://polar.sh](https://polar.sh) and sign up
2. Create an organization
3. For testing, use the [Sandbox Environment](https://sandbox.polar.sh)

### 2. Create a Product

1. In your Polar dashboard, go to **Products**
2. Click **Create Product**
3. Fill in product details:
   - Name
   - Description
   - Price (can be fixed, custom, or free)
   - Benefits (what customers get)
4. Copy the **Product ID** (you'll need this later)

### 3. Get API Credentials

1. Go to **Settings** → **Developers** → **Access Tokens**
2. Click **Create Token**
3. Give it a name (e.g., "Production API")
4. Copy the token (starts with `polar_at_...`)
5. **Important**: Save this token securely - you won't see it again!

### 4. Configure Webhook

1. In Polar dashboard, go to **Settings** → **Webhooks**
2. Click **Add Endpoint**
3. Set the URL to: `https://your-domain.com/api/polar/webhook`
   - For local testing with ngrok: `https://your-ngrok-id.ngrok-free.app/api/polar/webhook`
4. Select events to listen to:
   - ✅ `checkout.created`
   - ✅ `checkout.updated`
   - ✅ `order.created`
   - ✅ `subscription.created` (if using subscriptions)
   - ✅ `subscription.updated` (if using subscriptions)
5. Click **Generate Secret** and copy the webhook secret
6. Save the endpoint

### 5. Update Environment Variables

Add these to your `.env.local` file:

```env
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_at_your_token_here
POLAR_WEBHOOK_SECRET=your_webhook_secret_here
POLAR_SERVER=sandbox  # Use 'production' when ready to go live
```

### 6. Run Database Migration

Execute the SQL migration to add Polar settings:

```bash
# Using psql
psql -U your_username -d your_database -f add-polar-settings.sql

# Or using Supabase SQL Editor
# Copy and paste the contents of add-polar-settings.sql
```

### 7. Enable Polar in Admin Settings

1. Log in to your admin panel
2. Go to **Settings** → **Payment Settings**
3. Enable **Polar Payment**
4. Enter your **Product ID** from step 2
5. Save settings

## Testing the Integration

### Using Sandbox Environment

1. Set `POLAR_SERVER=sandbox` in your `.env.local`
2. Use sandbox credentials from [https://sandbox.polar.sh](https://sandbox.polar.sh)
3. Test cards are provided by Polar's payment processor

### Test Flow

1. Add items to cart
2. Go to checkout
3. Select **Polar** as payment method
4. Enter test email and name
5. Click **Continue to Polar Checkout**
6. Complete payment on Polar's hosted checkout page
7. You'll be redirected back to your success page

### Verify Webhook Events

1. Check your server logs for webhook events
2. In Polar dashboard, go to **Webhooks** → **Events**
3. You should see events like:
   - `checkout.created`
   - `checkout.updated` (status: succeeded)
   - `order.created`

## Going Live

### 1. Switch to Production

1. Create a production Polar account at [https://polar.sh](https://polar.sh)
2. Complete business verification
3. Create production products
4. Get production API token
5. Update `.env.local`:
   ```env
   POLAR_SERVER=production
   POLAR_ACCESS_TOKEN=polar_at_production_token
   ```

### 2. Update Webhook URL

1. In production Polar dashboard, add webhook endpoint
2. Use your production domain: `https://yourdomain.com/api/polar/webhook`
3. Update `POLAR_WEBHOOK_SECRET` with production secret

### 3. Test Production Flow

1. Make a small real transaction
2. Verify order is created in your database
3. Check webhook events are received
4. Confirm customer receives confirmation email

## Features Included

### ✅ Checkout Session Creation
- Creates hosted checkout page
- Handles customer information
- Supports multiple currencies
- Automatic tax calculation

### ✅ Webhook Handling
- Verifies webhook signatures
- Updates order status automatically
- Handles checkout completion
- Tracks Polar order IDs

### ✅ Order Management
- Saves orders to database
- Links Polar orders with your orders
- Tracks transaction status
- Stores customer information

## API Endpoints

### POST `/api/polar/checkout`
Creates a Polar checkout session.

**Request:**
```json
{
  "productId": "prod_xxx",
  "amount": 99.99,
  "currency": "USD",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "orderId": "ORDER_123"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://polar.sh/checkout/...",
  "checkoutId": "checkout_xxx"
}
```

### POST `/api/polar/webhook`
Receives webhook events from Polar (handled automatically).

## Troubleshooting

### Checkout session creation fails
- ✅ Verify `POLAR_ACCESS_TOKEN` is correct
- ✅ Check `POLAR_SERVER` matches your environment
- ✅ Ensure Product ID exists in your Polar account
- ✅ Check server logs for detailed error messages

### Webhooks not received
- ✅ Verify webhook URL is publicly accessible
- ✅ Check `POLAR_WEBHOOK_SECRET` is correct
- ✅ Use ngrok for local testing
- ✅ Check Polar dashboard webhook logs

### Orders not updating
- ✅ Verify webhook events are being received
- ✅ Check database connection
- ✅ Ensure orders table has `polar_order_id` column
- ✅ Review server logs for errors

### Customer redirected but order pending
- ✅ Check if webhook was received
- ✅ Verify checkout status in Polar dashboard
- ✅ Check for webhook processing errors in logs

## Advanced Configuration

### Multiple Products
You can create checkout sessions with different products:

```typescript
const response = await fetch('/api/polar/checkout', {
  method: 'POST',
  body: JSON.stringify({
    productId: 'prod_different_product',
    // ... other fields
  })
})
```

### Custom Metadata
Add custom data to track additional information:

```typescript
// In app/api/polar/checkout/route.ts
const checkoutSession = await polarApi.checkouts.create({
  // ... existing fields
  metadata: {
    orderId,
    customerName,
    customField: 'your-value',
  },
})
```

### Subscription Support
Polar supports subscriptions out of the box. Create a recurring product in Polar dashboard and use the same integration flow.

## Resources

- [Polar Documentation](https://polar.sh/docs)
- [Polar API Reference](https://docs.polar.sh/api-reference)
- [Polar Next.js Guide](https://polar.sh/docs/guides/nextjs)
- [Polar Sandbox](https://sandbox.polar.sh)
- [Polar Discord Community](https://discord.gg/polar)

## Support

If you encounter issues:
1. Check the [Polar Documentation](https://polar.sh/docs)
2. Review server logs for errors
3. Check Polar dashboard for webhook events
4. Contact Polar support via their dashboard

---

**Note**: This integration uses Polar as a merchant of record, meaning Polar handles all payment processing, tax compliance, and payouts. You receive clean payouts without worrying about international tax regulations.
