'use client';

import { usePathname, useParams } from 'next/navigation';

import { BreadcrumbElement } from 'app/api/breadcrumbs/route';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { crumbsLoad, crumbsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useBreadcrumbElements() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const params = useParams();

  const pathWithoutQueryString = pathname || '/';
  const crumbsItem = useAppSelector(
    (state) => state.breadcrumbs.crumbsByPath[pathWithoutQueryString]
  );

  const query = getPathParameters(pathname, params);

  const future = loadItemIfNecessary(crumbsItem, dispatch, {
    actionOnLoad: () => crumbsLoad(pathWithoutQueryString),
    actionOnSuccess: (item) => crumbsLoaded([pathWithoutQueryString, item]),
    loader: async () => {
      const queryString = query ? `&${query}` : '';
      const elements = await apiClient.get<BreadcrumbElement[]>(
        `/api/breadcrumbs?pathname=${pathname}${queryString}`
      );

      return { elements, id: pathWithoutQueryString };
    },
  });

  return future.data?.elements ?? [];
}

const getPathParameters = function (
  pathname: string | null,
  params: Record<string, string | string[]>
): string {
  // Only use parameters that are part of the path (e.g. [personId])
  // and not ones that are part of the actual querystring (e.g. ?filter_*)
  if (!pathname || !params) return '';

  return Object.entries(params)
    .filter(([key]) => pathname.includes(`[${key}]`))
    .map(([key, val]) => {
      const value = Array.isArray(val) ? val[0] : val;
      return `${key}=${value}`;
    })
    .join('&');
};
