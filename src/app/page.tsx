import { cookies, headers } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';

import { AppSession } from 'utils/types';
import { ZetkinUser } from 'utils/types/zetkin';
import getUserMemberships from 'utils/getUserMemberships';
import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Z = require('zetkin');

export default async function HomePage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = searchParams.code;

  if (code) {
    // OAuth callback handling
    const headersList = await headers();
    const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
    const host = headersList.get('host') || process.env.ZETKIN_APP_HOST || 'localhost:3000';

    let destination = '/my';

    try {
      const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_DOMAIN,
      });

      console.log('[OAuth Callback] Authenticating with code:', code.substring(0, 10) + '...');
      console.log('[OAuth Callback] Redirect URL:', `${protocol}://${host}/?code=${code.substring(0, 10)}...`);

      await z.authenticate(`${protocol}://${host}/?code=${code}`);

      const tokenData = z.getTokenData();
      console.log('[OAuth Callback] Token data received:', tokenData ? 'Yes' : 'No');

      if (!tokenData || !tokenData.access_token) {
        console.error('[OAuth Callback] Authentication succeeded but no token data received');
        // Redirect back to login with error
        redirect('/login?error=no_token');
      }

      const cookieStore = await cookies();
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

      // Store token data
      session.tokenData = tokenData;
      console.log('[OAuth Callback] Token data stored in session');

      // Get user info
      let user: ZetkinUser | null = null;
      try {
        const userRes = await z.resource('users', 'me').get();
        user = userRes.data.data as ZetkinUser;
        console.log('[OAuth Callback] User info retrieved:', user?.id);
      } catch (error) {
        console.error('[OAuth Callback] Failed to get user info:', error);
        user = null;
      }

      if (user) {
        try {
          // We need to pass a context-like object to getUserMemberships
          const ctx = { z };
          session.memberships = await getUserMemberships(ctx as any);
          console.log('[OAuth Callback] Memberships retrieved:', session.memberships?.length);
        } catch (error) {
          console.error('[OAuth Callback] Failed to get memberships:', error);
          session.memberships = null;
        }
      }

      // Check for stored redirect URL
      if (session.redirAfterLogin) {
        destination = session.redirAfterLogin;
        session.redirAfterLogin = null;
      }

      await session.save();
      console.log('[OAuth Callback] Session saved, redirecting to:', destination);
    } catch (err) {
      console.error('[OAuth Callback] Authentication failed:', err);
      console.error('[OAuth Callback] Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      // Redirect back to login with error parameter
      redirect('/login?error=auth_failed');
    }

    redirect(destination);
  }

  // No code, just redirect to /my
  redirect('/my');
}
