import { cookies, headers } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppSession } from 'utils/types';
import { ZetkinUser } from 'utils/types/zetkin';
import getUserMemberships from 'utils/getUserMemberships';
import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Z = require('zetkin');

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  console.log('[OAuth Callback] Received request with code:', code?.substring(0, 10) + '...');

  if (!code) {
    console.log('[OAuth Callback] No code provided, redirecting to organize');
    return redirect('/organize');
  }

  // OAuth callback handling
  const headersList = headers();
  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host = headersList.get('host') || process.env.ZETKIN_APP_HOST || 'localhost:3000';

  let destination = '/organize';

  try {
    const z = Z.construct({
      clientId: process.env.ZETKIN_CLIENT_ID,
      clientSecret: process.env.ZETKIN_CLIENT_SECRET,
      ssl: stringToBool(process.env.ZETKIN_USE_TLS),
      zetkinDomain: process.env.ZETKIN_API_DOMAIN,
    });

    console.log('[OAuth Callback] Authenticating with Zetkin...');
    await z.authenticate(`${protocol}://${host}/api/auth/callback?code=${code}`);
    console.log('[OAuth Callback] Authentication successful');

    const cookieStore = cookies();
    const session = await getIronSession<AppSession>(
      cookieStore as any,
      {
        cookieName: 'zsid',
        password: requiredEnvVar('SESSION_PASSWORD'),
        cookieOptions: {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        },
      }
    );

    // Get user info
    let user: ZetkinUser | null = null;
    try {
      const userRes = await z.resource('users', 'me').get();
      user = userRes.data.data as ZetkinUser;
      console.log('[OAuth Callback] User:', user?.first_name, user?.last_name);
    } catch (error) {
      console.error('[OAuth Callback] Failed to get user:', error);
      user = null;
    }

    // Store token data and memberships in session
    const tokenData = z.getTokenData();
    session.tokenData = tokenData;
    console.log('[OAuth Callback] Token data to store:', {
      hasAccessToken: !!tokenData.access_token,
      scope: tokenData.scope,
    });

    if (user) {
      try {
        // We need to pass a context-like object to getUserMemberships
        const ctx = { z };
        session.memberships = await getUserMemberships(ctx as any);
      } catch (error) {
        session.memberships = null;
      }
    }

    // Check for stored redirect URL
    if (session.redirAfterLogin) {
      destination = session.redirAfterLogin;
      session.redirAfterLogin = null;
      console.log('[OAuth Callback] Redirecting to stored path:', destination);
    } else {
      console.log('[OAuth Callback] No stored redirect, going to:', destination);
    }

    console.log('[OAuth Callback] About to save session...');
    await session.save();
    console.log('[OAuth Callback] Session saved successfully');
  } catch (err) {
    console.error('[OAuth Callback] Authentication error:', err);
    // If authentication failed, continue to default redirect
  }

  console.log('[OAuth Callback] Final redirect to:', destination);
  redirect(destination);
}
