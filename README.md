# Helping People Foundation - NGO Donation Website

This is a Next.js single-page donation website integrated with the IMB Payment Gateway.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Copy `.env.example` to `.env.local` and fill in your IMB API credentials:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Never commit `.env.local` to version control.*

3. Start the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into your Vercel account.
3. In the Vercel Dashboard, go to **Settings > Environment Variables** and add:
   - `IMB_API_TOKEN` (or Client ID/Secret if applicable)
   - `IMB_WEBHOOK_SECRET`
   - `IMB_API_URL`
   - `NEXT_PUBLIC_BASE_URL` (Set this to your production domain, e.g., `https://your-domain.com`)
4. Click **Deploy**.

## Webhook Configuration
After deploying to Vercel, copy your production domain and append `/api/imb/webhook`.
Paste this URL into your IMB Merchant Dashboard webhook settings:
`https://your-domain.com/api/imb/webhook`
