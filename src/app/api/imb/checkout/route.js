import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
    }

    // Example IMB Integration (Mock implementation based on standard payment gateways)
    const imbMerchantId = process.env.IMB_MERCHANT_ID;
    const imbApiKey = process.env.IMB_API_KEY;
    const imbApiUrl = process.env.IMB_API_URL || 'https://api.imbpay.in/v1/checkout';

    if (!imbMerchantId || !imbApiKey) {
      console.warn('IMB API credentials missing. Using simulation mode.');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return NextResponse.json({
        success: true,
        transactionId: `TXN_${Date.now()}`,
        checkoutUrl: `/checkout-simulation?amount=${amount}`,
        message: 'Simulation checkout URL generated'
      });
    }

    // Real API call to IMB
    const response = await fetch(imbApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imbApiKey}`,
        'X-Merchant-Id': imbMerchantId
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        orderId: `ORD_${Date.now()}`,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/imb/callback`,
        webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/imb/webhook`,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'IMB API error');
    }

    return NextResponse.json({
      success: true,
      transactionId: data.transactionId,
      checkoutUrl: data.checkoutUrl
    });

  } catch (error) {
    console.error('IMB Checkout Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment', details: error.message },
      { status: 500 }
    );
  }
}
