import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const imbApiToken = process.env.IMB_API_TOKEN;
    const imbApiUrl = process.env.IMB_API_URL || 'https://api.imbpay.in';
    const statusUrl = `${imbApiUrl.replace(/\/$/, '')}/v2/check-order-status`;

    if (!imbApiToken) {
      console.error('IMB API credentials missing.');
      return NextResponse.json({ error: 'Server configuration error: Missing payment gateway credentials.' }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append('user_token', imbApiToken);
    formData.append('order_id', orderId);

    // Real API call to IMB check status
    const response = await fetch(statusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    if (!response.ok) {
      console.error(`IMB Status API Error (Status ${response.status}):`, responseText.substring(0, 500));
      return NextResponse.json({ error: 'Gateway returned an error status.' }, { status: response.status });
    }

    if (!contentType || !contentType.includes('application/json')) {
      console.error('IMB Status API returned non-JSON response:', responseText.substring(0, 500));
      return NextResponse.json({ error: 'Gateway returned an invalid format.' }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('IMB Status API JSON Parse Error:', parseError);
      return NextResponse.json({ error: 'Gateway status response parse error.' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      statusData: data, // Exposing the parsed data to server logs/logic
      status: (data.result && data.result.status) || data.status || 'UNKNOWN',
    });

  } catch (error) {
    console.error('IMB Status Check Error:', error);
    return NextResponse.json(
      { error: 'Failed to check status', details: error.message },
      { status: 500 }
    );
  }
}
