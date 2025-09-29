-- Add RLS policy for order_items SELECT to restrict access to order owners only
-- This connects to the orders table to check if the authenticated user owns the order
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);