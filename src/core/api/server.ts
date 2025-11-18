/**
 * Server-side API utilities for use in Server Components
 *
 * Usage in Server Components:
 * ```tsx
 * import { getServerApiClient } from '@/core/api/server';
 *
 * export default async function MyPage({ params }: { params: { orgId: string } }) {
 *   const apiClient = await getServerApiClient();
 *   const campaigns = await apiClient.get(`/api/orgs/${params.orgId}/campaigns`);
 *
 *   return <CampaignsList campaigns={campaigns} />;
 * }
 * ```
 */

import { cookies, headers } from 'next/headers';

import BackendApiClient from './client/BackendApiClient';

/**
 * Creates an authenticated API client for use in Server Components.
 * Automatically includes session authentication from cookies.
 *
 * @returns BackendApiClient instance configured with current request context
 * @throws Will throw if session is invalid or missing (handled by middleware)
 */
export async function getServerApiClient(): Promise<BackendApiClient> {
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);

  return new BackendApiClient(headersObject);
}

/**
 * Fetch data from API with authentication in Server Components.
 * This is a convenience wrapper around getServerApiClient().get()
 *
 * @param path API path (e.g., '/api/orgs/123/campaigns')
 * @returns Fetched data
 */
export async function fetchServerData<T>(path: string): Promise<T> {
  const apiClient = await getServerApiClient();
  return apiClient.get<T>(path);
}
