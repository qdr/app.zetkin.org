import { cookies, headers } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppSession } from 'utils/types';
import { stringToBool } from 'utils/stringUtils';
import requiredEnvVar from 'utils/requiredEnvVar';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Z = require('zetkin');

// If/when `URL.parse` is supported, use that instead of this
const parseUrl = (
  urlLike: string | null | undefined,
  base: string | undefined
): URL | null => {
  if (!urlLike) {
    return null;
  }
  try {
    return new URL(urlLike, base);
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const z = Z.construct({
    clientId: process.env.ZETKIN_CLIENT_ID,
    clientSecret: process.env.ZETKIN_CLIENT_SECRET,
    ssl: stringToBool(process.env.ZETKIN_USE_TLS),
    zetkinDomain: process.env.ZETKIN_API_DOMAIN,
  });

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const headersList = headers();
  const host =
    headersList.get('host') || process.env.ZETKIN_APP_HOST || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level');
  const redirectParam = searchParams.get('redirect');

  let scopes;
  if (level) {
    const levelNum = parseInt(level);
    if (levelNum > 1) {
      scopes = [`level${levelNum}`];
    }
  }

  if (redirectParam) {
    // Store redirect URL in session
    const redirectAsUrl = parseUrl(redirectParam, baseUrl);
    const destinationPath = redirectAsUrl
      ? `${redirectAsUrl.pathname}${redirectAsUrl.search}`
      : '/';

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
    session.redirAfterLogin = destinationPath;
    await session.save();
  }

  const loginUrl = z.getLoginUrl(`${baseUrl}/`, scopes);
  redirect(loginUrl);
}
