import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    // Read the raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-imb-signature');
    const webhookSecret = process.env.IMB_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Missing signature or configuration' }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    // Process the webhook payload (e.g., update database)
    const { transactionId, status, amount } = data;
    
    // Mock database duplicate check
    // const existingTxn = await db.transactions.findById(transactionId);
    // if (existingTxn && existingTxn.status === 'SUCCESS') {
    //   console.log(`Duplicate webhook for TXN: ${transactionId}`);
    //   return NextResponse.json({ received: true, note: 'Already processed' });
    // }

    if (status === 'SUCCESS') {
      console.log(`Payment successful for TXN: ${transactionId} (Amount: ${amount})`);
      // Update database status to SUCCESS
    } else if (status === 'FAILED') {
      console.log(`Payment failed for TXN: ${transactionId}`);
      // Update database status to FAILED
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
