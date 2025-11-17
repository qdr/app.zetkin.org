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
  const pathWithoutQueryString = pathname;
  const crumbsItem = useAppSelector(
    (state) => state.breadcrumbs.crumbsByPath[pathWithoutQueryString]
  );

  // Convert actual pathname to template pathname and extract query params
  const { templatePath, queryParams } = convertToTemplatePath(pathname, params);

  const future = loadItemIfNecessary(crumbsItem, dispatch, {
    actionOnLoad: () => crumbsLoad(pathWithoutQueryString),
    actionOnSuccess: (item) => crumbsLoaded([pathWithoutQueryString, item]),
    loader: async () => {
      const queryString = queryParams ? `&${queryParams}` : '';
      const elements = await apiClient.get<BreadcrumbElement[]>(
        `/api/breadcrumbs?pathname=${templatePath}${queryString}`
      );

      return { elements, id: pathWithoutQueryString };
    },
  });

  return future.data?.elements ?? [];
}

function convertToTemplatePath(
  pathname: string,
  params: Record<string, string | string[]>
): { templatePath: string; queryParams: string } {
  let templatePath = pathname;
  const queryParts: string[] = [];

  // Convert actual values back to template format
  // e.g., /organize/1/projects -> /organize/[orgId]/projects
  for (const [key, value] of Object.entries(params)) {
    const valueStr = Array.isArray(value) ? value.join('/') : value;

    // Replace the actual value with [key] in the path
    templatePath = templatePath.replace(`/${valueStr}`, `/[${key}]`);

    // Add to query params
    queryParts.push(`${key}=${valueStr}`);
  }

  return {
    templatePath,
    queryParams: queryParts.join('&'),
  };
}
