import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, donor } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
    }

    if (!donor || !donor.fullName || !donor.mobile || !donor.email) {
      return NextResponse.json({ error: 'Missing mandatory donor details' }, { status: 400 });
    }

    if (!/^[6-9]\d{9}$/.test(donor.mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
    }

    // Example IMB Integration (Mock implementation based on standard payment gateways)
    const imbApiToken = process.env.IMB_API_TOKEN;
    const imbApiUrl = process.env.IMB_API_URL || 'https://api.imbpay.in/v1/checkout';

    if (!imbApiToken) {
      console.error('IMB API credentials missing.');
      return NextResponse.json({ error: 'Server configuration error: Missing payment gateway credentials.' }, { status: 500 });
    }

    // Real API call to IMB
    const response = await fetch(imbApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imbApiToken}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        orderId: `ORD_${Date.now()}`,
        donorDetails: {
          name: donor.fullName,
          mobile: donor.mobile,
          email: donor.email,
          message: donor.message || ""
        },
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
