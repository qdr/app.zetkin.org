'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { BreadcrumbElement } from 'pages/api/breadcrumbs';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { crumbsLoad, crumbsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useBreadcrumbElements() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const pathWithoutQueryString = pathname;
  const crumbsItem = useAppSelector(
    (state) => state.breadcrumbs.crumbsByPath[pathWithoutQueryString]
  );

  const query = getPathParameters(pathname, params);

  const future = loadItemIfNecessary(crumbsItem, dispatch, {
    actionOnLoad: () => crumbsLoad(pathWithoutQueryString),
    actionOnSuccess: (item) => crumbsLoaded([pathWithoutQueryString, item]),
    loader: async () => {
      const elements = await apiClient.get<BreadcrumbElement[]>(
        `/api/breadcrumbs?pathname=${pathname}&${query}`
      );

      return { elements, id: pathWithoutQueryString };
    },
  });

  return future.data?.elements ?? [];
}

const getPathParameters = function (pathname: string, params: ReturnType<typeof useParams>): string {
  // Only use parameters that are part of the path (e.g. [personId])
  // and not ones that are part of the actual querystring (e.g. ?filter_*)
  return Object.entries(params)
    .filter(([key]) => pathname.includes(`[${key}]`))
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};
