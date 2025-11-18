'use client';

import { isEqual } from 'lodash';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  DataGridProProps,
  GridFilterModel,
  GridLogicOperator,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';

interface UseModelsFromQueryString {
  filterModel: GridFilterModel;
  gridProps: Required<
    Pick<
      DataGridProProps,
      'filterModel' | 'onFilterModelChange' | 'onSortModelChange' | 'sortModel'
    >
  >;
  setFilterModel: (model: GridFilterModel) => void;
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

export default function useModelsFromQueryString(): UseModelsFromQueryString {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    parseFilterModelFromQuery(searchParams)
  );

  const [sortModel, setSortModel] = useState<GridSortModel>(
    parseSortModelFromQuery(searchParams)
  );

  // Update router URL when model changes
  useEffect(() => {
    const qs = [
      serializeFilterQueryString(filterModel),
      serializeSortQueryString(sortModel),
    ]
      .filter((item) => !!item.length)
      .join('&');

    const modelPath = qs ? `${pathname}?${qs}` : pathname;
    const currentPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (modelPath != currentPath) {
      router.replace(modelPath, { scroll: false });
    }
  }, [filterModel, sortModel, router, pathname, searchParams]);

  // Update model when router URL changes
  useEffect(() => {
    const routerFilterModel = parseFilterModelFromQuery(searchParams);
    const routerSortModel = parseSortModelFromQuery(searchParams);

    if (!isEqual(routerFilterModel, filterModel)) {
      setFilterModel(routerFilterModel);
    }

    if (!isEqual(routerSortModel, sortModel)) {
      setSortModel(routerSortModel);
    }
  }, [searchParams]);

  return {
    filterModel,
    gridProps: {
      filterModel: filterModel,
      onFilterModelChange: (model) => {
        if (!isEqual(model, filterModel)) {
          setFilterModel(model);
        }
      },
      onSortModelChange: (model) => {
        if (!isEqual(model, sortModel)) {
          setSortModel(model);
        }
      },
      sortModel: sortModel,
    },
    setFilterModel,
    setSortModel,
    sortModel,
  };
}

function parseFilterModelFromQuery(searchParams: ReadonlyURLSearchParams): GridFilterModel {
  const items = Array.from(searchParams.entries())
    .filter(([param]) => param.startsWith('filter_'))
    .flatMap(([param, val], idx) => {
      const values = [val];

      return values.map((val, valIdx) => {
        // Split the query param, ignoring the first field ('filter')
        const paramFields = param.split('_').slice(1);

        // The last will be the operator
        const op = paramFields[paramFields.length - 1];
        paramFields.pop();

        // The remaining ones are the name of the field, possibly containing underscores
        const field = paramFields.join('_');

        return {
          field: field,
          id: idx * 10000 + valIdx,
          operator: op,
          value: val || undefined,
        };
      });
    });

  return {
    items,
    ...(!!items.length && {
      logicOperator:
        searchParams.get('filterOperator') == 'or'
          ? GridLogicOperator.Or
          : GridLogicOperator.And,
    }),
  };
}

function parseSortModelFromQuery(searchParams: ReadonlyURLSearchParams): GridSortModel {
  const sort = searchParams.get('sort');
  if (sort) {
    return sort.split(',').map((sortStr) => {
      const direction = sortStr.charAt(0) == '-' ? 'desc' : 'asc';
      const field = '+-'.includes(sortStr.charAt(0))
        ? sortStr.slice(1)
        : sortStr;

      return {
        field,
        sort: direction,
      };
    });
  } else {
    return [];
  }
}

function serializeFilterQueryString(filterModel: GridFilterModel): string {
  const qs = filterModel.items
    .map(
      (filter) =>
        `filter_${filter.field}_${filter.operator}` +
        (filter.value ? `=${encodeURIComponent(filter.value)}` : '')
    )
    .join('&');

  // Include the operator if more than one filter
  if (filterModel.items.length > 1) {
    return qs + `&filterOperator=${filterModel.logicOperator || 'and'}`;
  } else {
    return qs;
  }
}

function serializeSortQueryString(sortModel: GridSortModel): string {
  if (sortModel.length) {
    return (
      'sort=' +
      sortModel
        .map((item) => (item.sort == 'desc' ? `-${item.field}` : item.field))
        .join(',')
    );
  } else {
    return '';
  }
}
