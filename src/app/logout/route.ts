import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';

import { AppSession } from 'utils/types';
import { stringToBool } from 'utils/stringUtils';
import requiredEnvVar from 'utils/requiredEnvVar';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Z = require('zetkin');

export async function GET() {
  const cookieStore = cookies();
  const session = await getIronSession<AppSession>(cookieStore as any, {
    cookieName: 'zsid',
    password: requiredEnvVar('SESSION_PASSWORD'),
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });

  if (session.tokenData) {
    try {
      const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_DOMAIN,
      });
      z.setTokenData(session.tokenData);
      await z.resource('session').del();
    } catch (error) {
      // If user cannot log out, they are probably already logged out
    }
  }

  session.destroy();

  redirect('/');
}
