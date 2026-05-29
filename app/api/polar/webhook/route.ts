import { Webhooks } from "@polar-sh/nextjs";
import { supabase } from "../../../../lib/supabase";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  onPayload: async (payload) => {
    console.log('Polar webhook received:', payload.type)
  },

  onCheckoutCreated: async (payload) => {
    console.log('Checkout created:', payload.data.id)
  },

  onCheckoutUpdated: async (payload) => {
    const checkout = payload.data
    console.log('Checkout updated:', checkout.id, 'Status:', checkout.status)
    
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

  onOrderCreated: async (payload) => {
    const order = payload.data
    console.log('Order created:', order.id)
    
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

  onOrderPaid: async (payload) => {
    const order = payload.data
    console.log('Order paid:', order.id)

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          polar_order_id: order.id,
        })
        .eq('transaction_id', order.checkoutId)

      if (error) {
        console.error('Failed to update order on payment:', error)
      }
    } catch (err) {
      console.error('Error updating order on payment:', err)
    }
  },

  onSubscriptionCreated: async (payload) => {
    console.log('Subscription created:', payload.data.id)
  },

  onSubscriptionUpdated: async (payload) => {
    console.log('Subscription updated:', payload.data.id)
  },

  onSubscriptionCanceled: async (payload) => {
    console.log('Subscription canceled:', payload.data.id)
  },
});
