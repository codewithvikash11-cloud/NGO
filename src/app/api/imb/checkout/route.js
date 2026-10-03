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

    const imbApiToken = process.env.IMB_API_TOKEN;
    // We enforce the new V2 URL given in the documentation
    const imbApiUrl = process.env.IMB_API_URL || 'https://api.imbpay.in';
    const createOrderUrl = `${imbApiUrl.replace(/\/$/, '')}/v2/create-order`;

    if (!imbApiToken) {
      console.error('IMB API credentials missing.');
      return NextResponse.json({ error: 'Server configuration error: Missing payment gateway credentials.' }, { status: 500 });
    }

    const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ngo-flax.vercel.app/';

    // Prepare x-www-form-urlencoded payload
    const formData = new URLSearchParams();
    formData.append('customer_mobile', donor.mobile);
    formData.append('user_token', imbApiToken);
    formData.append('amount', amount.toString());
    formData.append('order_id', orderId);
    formData.append('redirect_url', redirectUrl);
    formData.append('remark1', donor.email);
    formData.append('remark2', `Donation from ${donor.fullName}`);

    // Real API call to IMB V2 Create Order
    const response = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    if (!response.ok) {
      console.error(`IMB API Error (Status ${response.status}):`, responseText.substring(0, 500));
      return NextResponse.json({ error: `Payment gateway error. Status: ${response.status}` }, { status: response.status });
    }

    if (!contentType || !contentType.includes('application/json')) {
      console.error('IMB API returned non-JSON response:', responseText.substring(0, 500));
      return NextResponse.json({ error: 'Gateway returned an invalid format. Please try again later.' }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('IMB API JSON Parse Error:', parseError);
      return NextResponse.json({ error: 'Gateway response parse error.' }, { status: 502 });
    }

    // Extract payment URL based on the described structure
    const paymentUrl = (data.result && data.result.payment_url) || data.payment_url;

    if (!paymentUrl) {
      console.error('IMB API Missing payment_url in response:', data);
      return NextResponse.json({ error: 'Gateway did not return a valid checkout URL.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      checkoutUrl: paymentUrl
    });

  } catch (error) {
    console.error('IMB Checkout Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment', details: error.message },
      { status: 500 }
    );
  }
}
