import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';

/**
 * Require authentication for organize section pages.
 * Replacement for scaffold pattern from Pages Router.
 *
 * @param requiredLevel - Auth level required (1 = simple login, 2 = 2FA)
 * @returns Object with user, apiClient, and headersList
 */
export async function requireAuth(requiredLevel: number = 2) {
  const headersList = await headers();
  const headersObject = Object.fromEntries(headersList.entries());
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser;

  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    // Not authenticated - redirect to login
    const path = headersList.get('x-requested-path') || '/organize';
    redirect(`/login?level=${requiredLevel}&redirect=${path}`);
  }

  return { user, apiClient, headersList };
}

/**
 * Check if user has access to the specified organization.
 * Used in combination with requireAuth() for org-specific pages.
 *
 * @param apiClient - BackendApiClient instance from requireAuth()
 * @param user - User object from requireAuth()
 * @param orgId - Organization ID to check access for
 * @param allowNonOfficials - Whether to allow non-official members (default: false)
 * @returns true if user has access
 * @throws Error if user doesn't have access (will trigger 404)
 */
export async function requireOrgAccess(
  apiClient: BackendApiClient,
  user: ZetkinUser,
  orgId: string,
  allowNonOfficials: boolean = false
): Promise<boolean> {
  // Superusers have access to everything
  if (user.is_superuser) {
    return true;
  }

  // Check if user has membership in this org
  const memberships = await apiClient.get<ZetkinMembership[]>(
    '/api/users/me/memberships'
  );

  const membership = memberships.find(
    (m) => m.organization.id === parseInt(orgId)
  );

  if (!membership) {
    throw new Error('No access to organization');
  }

  // If non-officials are not allowed, check role (admin or organizer are officials)
  if (!allowNonOfficials) {
    const isOfficial =
      membership.role === 'admin' || membership.role === 'organizer';
    if (!isOfficial) {
      throw new Error('Must be an official to access this page');
    }
  }

  return true;
}
