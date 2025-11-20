import shouldLoad from 'core/caching/shouldLoad';
import { ViewTreeData } from 'pages/api/views/tree';
import { allItemsLoad, allItemsLoaded, loadMoreViews } from '../store';
import {
  IFuture,
  LoadingFuture,
  PromiseFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export interface ViewTreeReturn {
  data: ViewTreeData;
  hasMore: boolean;
  loadMore: () => void;
}

export default function useViewTree(orgId: number): IFuture<ViewTreeReturn> {
  const apiClient = useApiClient();
  const views = useAppSelector((state) => state.views);
  const dispatch = useAppDispatch();

  const currentOffset = views.viewList.items.length;

  const loadMoreItems = () => {
    dispatch(allItemsLoad());
    apiClient
      .get<{ data: ViewTreeData; meta: { hasMore: boolean } }>(
        `/api/views/tree?orgId=${orgId}&offset=${currentOffset}&limit=80`
      )
      .then((response) => {
        dispatch(loadMoreViews({ views: response.data.views, hasMore: response.meta.hasMore }));
      });
  };

  if (shouldLoad(views.folderList) || shouldLoad(views.viewList)) {
    dispatch(allItemsLoad());
    const promise = apiClient
      .get<{ data: ViewTreeData; meta: { hasMore: boolean } }>(
        `/api/views/tree?orgId=${orgId}&offset=0&limit=80`
      )
      .then((response) => {
        dispatch(allItemsLoaded({ ...response.data, hasMore: response.meta.hasMore }));
        return {
          data: response.data,
          hasMore: response.meta.hasMore,
          loadMore: loadMoreItems,
        };
      });
    return new PromiseFuture(promise);
  } else if (
    (views.viewList.isLoading && !views.viewList.loaded) ||
    (views.folderList.isLoading && !views.folderList.loaded)
  ) {
    return new LoadingFuture();
  } else {
    const data: ViewTreeData = {
      folders: views.folderList.items.map((item) => item.data!),
      views: views.viewList.items
        .filter((item) => !item.deleted)
        .map((item) => item.data!),
    };

    return new ResolvedFuture({
      data,
      hasMore: views.viewList.hasMore ?? false,
      loadMore: loadMoreItems,
    });
  }
}
