import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let data;

    // Webhook logic for legacy token API. We won't use HMAC verification here
    // since the user states not to invent a webhook signature system.
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      data = Object.fromEntries(new URLSearchParams(text));
    } else {
      // Fallback
      const text = await req.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    const orderId = data.order_id || data.orderId;
    const status = data.status || data.txn_status;
    const amount = data.amount;

    if (!orderId) {
       console.error('Webhook payload missing order ID:', data);
       return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // In a real application, you would do a database lookup here:
    // const order = await db.getOrder(orderId);
    // if (order.status === 'SUCCESS') return NextResponse.json({ received: true }); // Prevent duplicate
    
    if (String(status).toUpperCase() === 'SUCCESS') {
      console.log(`[Webhook] Payment successful for Order: ${orderId} (Amount: ${amount})`);
      // Update database status to SUCCESS
    } else if (String(status).toUpperCase() === 'FAILED') {
      console.log(`[Webhook] Payment failed for Order: ${orderId}`);
      // Update database status to FAILED
    } else {
      console.log(`[Webhook] Received update for Order: ${orderId}, Status: ${status}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('IMB Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
