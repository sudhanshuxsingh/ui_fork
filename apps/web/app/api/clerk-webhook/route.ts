import { NextResponse } from 'next/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = req.headers;

  const heads = {
    'svix-id': headersList.get('svix-id'),
    'svix-timestamp': headersList.get('svix-timestamp'),
    'svix-signature': headersList.get('svix-signature'),
  };

  // Check if all required headers are present
  if (!heads['svix-id'] || !heads['svix-timestamp'] || !heads['svix-signature']) {
    console.error('Missing required headers');
    return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('Missing webhook secret');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, heads as WebhookRequiredHeaders) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification error:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const { type, data: user } = evt;

  switch (type) {
    case 'user.created':
    case 'user.updated':
      // eslint-disable-next-line no-case-declarations
      const { error } = await supabaseAdmin.from('users').upsert({
        id: user.id,
        username: user.username ?? null,
        image_url: user.image_url ?? null,
        email: user.email_addresses[0]?.email_address ?? null,
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
      });

      if (error) {
        console.error('User sync error with Supabase:', error);
        return NextResponse.json({ error: 'Failed to sync user with Supabase' }, { status: 500 });
      }
      break;

    case 'user.deleted':
      // eslint-disable-next-line no-case-declarations
      const { error: deleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .match({ id: user.id });

      if (deleteError) {
        console.error('User deletion error from Supabase:', deleteError);
        return NextResponse.json({ error: 'Failed to delete user from Supabase' }, { status: 500 });
      }
      break;

    default:
      console.warn('Unknown event type:', type);
  }

  return NextResponse.json({ message: 'Webhook processed successfully' });
}

export async function GET() {
  return NextResponse.json({ message: 'Clerk webhook endpoint' });
}
