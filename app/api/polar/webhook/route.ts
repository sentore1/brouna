import { Webhooks } from "@polar-sh/nextjs";
import { supabase } from "../../../../lib/supabase";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  onPayload: async (payload) => {
    console.log('Polar webhook received:', payload.type)
  },

  onCheckoutCreated: async (checkout) => {
    console.log('Checkout created:', checkout.id)
  },

  onCheckoutUpdated: async (checkout) => {
    console.log('Checkout updated:', checkout.id, 'Status:', checkout)
    
    // When checkout payment is fully completed, update order status
    // 'confirmed' = customer submitted form (processing), 'succeeded' = payment done
    if (checkout.status === 'succeeded') {
      const orderId = checkout.metadata?.orderId
      
      if (orderId) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ 
              status: 'completed',
              transaction_id: checkout.id,
            })
            .eq('transaction_id', orderId)

          if (error) {
            console.error('Failed to update order:', error)
          } else {
            console.log('Order updated successfully:', orderId)
          }
        } catch (err) {
          console.error('Error updating order:', err)
        }
      }
    }
  },

  onOrderCreated: async (order) => {
    console.log('Order created:', order.id)
    
    // Update order in database with Polar order details
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          polar_order_id: order.id,
        })
        .eq('transaction_id', order.checkoutId)

      if (error) {
        console.error('Failed to update order with Polar order ID:', error)
      }
    } catch (err) {
      console.error('Error updating order:', err)
    }
  },

  onSubscriptionCreated: async (subscription) => {
    console.log('Subscription created:', subscription.id)
  },

  onSubscriptionUpdated: async (subscription) => {
    console.log('Subscription updated:', subscription.id)
  },

  onSubscriptionCanceled: async (subscription) => {
    console.log('Subscription canceled:', subscription.id)
  },
});
