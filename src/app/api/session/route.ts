import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

import { AppSession } from 'utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';

export async function GET() {
  try {
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

    // Check if we have valid token data
    if (!session.tokenData || !session.tokenData.access_token) {
      console.log('[Session API] No token data found in session');
      return NextResponse.json(
        { data: { level: 0, isAuthenticated: false } },
        { status: 200 }
      );
    }

    console.log('[Session API] Token data found, scope:', session.tokenData.scope);

    // Determine auth level based on token scopes
    // Scope can be a string or an array
    let scopes: string[] = [];
    if (typeof session.tokenData.scope === 'string') {
      scopes = session.tokenData.scope.split(' ');
    } else if (Array.isArray(session.tokenData.scope)) {
      scopes = session.tokenData.scope;
    }

    let level = 1; // Default level for basic authentication

    // Check for level2 scope (2FA)
    if (scopes.includes('level2')) {
      level = 2;
    }

    console.log('[Session API] Returning level:', level, 'scopes:', scopes);

    return NextResponse.json({
      data: {
        level,
        isAuthenticated: true,
        scopes,
      },
    });
  } catch (error) {
    console.error('[Session API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        level: 0,
        isAuthenticated: false,
        error: 'Session error',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
