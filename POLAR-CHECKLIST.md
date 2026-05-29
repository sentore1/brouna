# Polar Integration Checklist

Use this checklist to ensure your Polar payment gateway is properly configured.

## 📋 Pre-Launch Checklist

### 1. Polar Account Setup
- [ ] Created Polar account (sandbox or production)
- [ ] Created organization
- [ ] Completed business verification (production only)
- [ ] Added bank account for payouts (production only)

### 2. Product Configuration
- [ ] Created at least one product in Polar dashboard
- [ ] Set product name and description
- [ ] Configured pricing (fixed/custom/free)
- [ ] Added product benefits
- [ ] Copied Product ID

### 3. API Credentials
- [ ] Generated Access Token from Polar dashboard
- [ ] Copied token (starts with `polar_at_`)
- [ ] Stored token securely
- [ ] Added to `.env.local` as `POLAR_ACCESS_TOKEN`

### 4. Webhook Configuration
- [ ] Created webhook endpoint in Polar dashboard
- [ ] Set webhook URL (production or ngrok for testing)
- [ ] Selected events: `checkout.*`, `order.*`
- [ ] Generated webhook secret
- [ ] Added to `.env.local` as `POLAR_WEBHOOK_SECRET`
- [ ] Set `POLAR_SERVER` to `sandbox` or `production`

### 5. Database Setup
- [ ] Ran `add-polar-settings.sql` migration
- [ ] Verified `payment_polar_enabled` column exists in `site_settings`
- [ ] Verified `polar_product_id` column exists in `site_settings`
- [ ] Verified `polar_order_id` column exists in `orders`
- [ ] Verified index `idx_orders_polar_order_id` exists

### 6. Environment Variables
```env
- [ ] POLAR_ACCESS_TOKEN=polar_at_xxxxx
- [ ] POLAR_WEBHOOK_SECRET=xxxxx
- [ ] POLAR_SERVER=sandbox (or production)
```

### 7. Admin Panel Configuration
- [ ] Logged into admin panel
- [ ] Navigated to Settings tab
- [ ] Enabled Polar payment method
- [ ] Entered Product ID
- [ ] Saved settings
- [ ] Verified settings persisted after refresh

### 8. Testing (Sandbox)
- [ ] Started development server (`npm run dev`)
- [ ] Added items to cart
- [ ] Went to checkout
- [ ] Selected Polar payment method
- [ ] Entered test email and name
- [ ] Clicked "Continue to Polar Checkout"
- [ ] Redirected to Polar checkout page
- [ ] Completed test payment
- [ ] Redirected back to success page
- [ ] Verified order created in database
- [ ] Checked webhook events received (server logs)
- [ ] Verified order status updated to "completed"

### 9. Webhook Testing
- [ ] Set up ngrok tunnel (for local testing)
- [ ] Updated webhook URL in Polar dashboard
- [ ] Made test payment
- [ ] Checked server logs for webhook events
- [ ] Verified webhook signature validation
- [ ] Checked Polar dashboard webhook logs
- [ ] Confirmed order status updates

### 10. Production Preparation
- [ ] Created production Polar account
- [ ] Completed business verification
- [ ] Created production products
- [ ] Generated production API token
- [ ] Updated `.env.local` with production credentials
- [ ] Set `POLAR_SERVER=production`
- [ ] Updated webhook URL to production domain
- [ ] Generated production webhook secret
- [ ] Tested production checkout flow
- [ ] Made small real transaction to verify

### 11. Security Verification
- [ ] API tokens stored in `.env.local` (not committed to git)
- [ ] `.env.local` in `.gitignore`
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled for production webhook URL
- [ ] Customer IP forwarding configured

### 12. Monitoring Setup
- [ ] Server logging configured
- [ ] Webhook event logging enabled
- [ ] Error tracking set up
- [ ] Order status monitoring
- [ ] Payment failure alerts configured

### 13. Documentation Review
- [ ] Read POLAR-QUICK-START.md
- [ ] Read POLAR-SETUP.md
- [ ] Reviewed POLAR-INTEGRATION-SUMMARY.md
- [ ] Bookmarked Polar documentation
- [ ] Joined Polar Discord (optional)

### 14. Customer Experience
- [ ] Tested checkout flow on desktop
- [ ] Tested checkout flow on mobile
- [ ] Verified email confirmation sent
- [ ] Checked order appears in customer account
- [ ] Tested with different currencies
- [ ] Verified tax calculation

### 15. Admin Experience
- [ ] Can view orders in admin panel
- [ ] Can see Polar order IDs
- [ ] Can track payment status
- [ ] Can access Polar dashboard
- [ ] Can view webhook logs

## 🚨 Common Issues

### Issue: Checkout session creation fails
**Check:**
- [ ] `POLAR_ACCESS_TOKEN` is correct
- [ ] `POLAR_SERVER` matches your environment
- [ ] Product ID exists in Polar dashboard
- [ ] API token has correct permissions

### Issue: Webhooks not received
**Check:**
- [ ] Webhook URL is publicly accessible
- [ ] `POLAR_WEBHOOK_SECRET` is correct
- [ ] Using ngrok for local testing
- [ ] Webhook events selected in Polar dashboard
- [ ] Server is running and accessible

### Issue: Orders not updating
**Check:**
- [ ] Webhook events are being received (check logs)
- [ ] Database migration ran successfully
- [ ] Supabase connection is working
- [ ] No errors in webhook handler

### Issue: Customer redirected but order pending
**Check:**
- [ ] Webhook was received (check Polar dashboard)
- [ ] Checkout status in Polar dashboard
- [ ] Webhook processing errors in logs
- [ ] Order ID matching logic

## ✅ Launch Readiness

All items checked? You're ready to launch! 🚀

### Final Steps:
1. Switch to production environment
2. Make a small test transaction
3. Verify everything works
4. Monitor for 24 hours
5. Announce to customers

## 📞 Support Contacts

- **Polar Documentation**: https://polar.sh/docs
- **Polar Support**: support@polar.sh
- **Polar Discord**: https://discord.gg/polar
- **API Reference**: https://docs.polar.sh/api-reference

---

**Last Updated**: After integration completion
**Status**: Ready for configuration and testing
