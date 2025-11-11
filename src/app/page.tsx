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

      await z.authenticate(`${protocol}://${host}/?code=${code}`);

      const cookieStore = cookies();
      const session = await getIronSession<AppSession>(
        cookieStore as any,
        {
          cookieName: 'zsid',
          password: requiredEnvVar('SESSION_PASSWORD'),
        }
      );

      // Get user info
      let user: ZetkinUser | null = null;
      try {
        const userRes = await z.resource('users', 'me').get();
        user = userRes.data.data as ZetkinUser;
      } catch (error) {
        user = null;
      }

      // Store token data and memberships in session
      session.tokenData = z.getTokenData();
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
      }

      await session.save();
    } catch (err) {
      // If authentication failed, continue to default redirect
    }

    redirect(destination);
  }

  // No code, just redirect to organize
  redirect('/organize');
}
