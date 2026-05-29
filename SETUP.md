# SIZA - Minimalist Fashion E-commerce

A modern, minimalistic fashion e-commerce website built with Next.js, Supabase, and KPay integration.

## Features

- **Minimalist Design**: Clean, white background with elegant typography
- **Product Management**: Full CMS for adding/editing products
- **KPay Integration**: Support for mobile money and card payments
- **Responsive Design**: Works perfectly on all devices
- **Real-time Database**: Powered by Supabase

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
KPAY_USERNAME=your_kpay_username
KPAY_PASSWORD=your_kpay_password
KPAY_RETAILER_ID=your_retailer_id
KPAY_BASE_URL=https://pay.esicia.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `database-schema.sql` in your Supabase SQL editor
3. This will create all necessary tables and sample data

### 3. KPay Setup

1. Contact KPay to get your credentials
2. Provide your webhook URL: `https://yourdomain.com/api/kpay/webhook`
3. Get your IP whitelisted for API access

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## Project Structure

```
├── app/
│   ├── admin/          # CMS dashboard
│   ├── api/            # API routes
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Payment processing
│   ├── products/       # Product listing
│   └── page.tsx        # Homepage
├── components/         # Reusable components
├── lib/               # Utilities (Supabase, KPay)
└── database-schema.sql # Database setup
```

## Key Pages

- **Homepage** (`/`): Hero section with featured products
- **Products** (`/products`): Product catalog with filtering
- **Admin Dashboard** (`/admin`): CMS for managing products
- **Cart** (`/cart`): Shopping cart management
- **Checkout** (`/checkout`): Payment processing with KPay

## Payment Methods Supported

- MTN Mobile Money
- Airtel Money
- Visa/Mastercard
- SPENN
- SmartCash

## Admin Access

Visit `/admin` to access the product management dashboard. You can:
- Add new products
- Edit existing products
- Delete products
- View product statistics

## Deployment

1. Deploy to Vercel or your preferred platform
2. Update environment variables in production
3. Update KPay webhook URL to production domain
4. Test payment flow with KPay test cards

## Support

For KPay integration issues, refer to the KPay API documentation or contact their support team.