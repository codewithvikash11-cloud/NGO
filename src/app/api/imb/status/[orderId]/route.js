import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const imbApiToken = process.env.IMB_API_TOKEN;
    const imbApiUrl = process.env.IMB_API_URL || 'https://api.imbpay.in';

    if (!imbApiToken) {
      console.error('IMB API credentials missing.');
      return NextResponse.json({ error: 'Server configuration error: Missing payment gateway credentials.' }, { status: 500 });
    }

    // Real API call to IMB check status
    const response = await fetch(`${imbApiUrl}/v1/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imbApiToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'IMB API error during status check');
    }

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      status: data.status, // SUCCESS, FAILED, PENDING
    });

  } catch (error) {
    console.error('IMB Status Check Error:', error);
    return NextResponse.json(
      { error: 'Failed to check status', details: error.message },
      { status: 500 }
    );
  }
}
