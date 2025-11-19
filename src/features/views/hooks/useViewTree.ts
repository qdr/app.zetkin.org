import { useEffect } from 'react';
import shouldLoad from 'core/caching/shouldLoad';
import { ViewTreeData } from 'pages/api/views/tree';
import { allItemsLoad, allItemsLoaded } from '../store';
import {
  IFuture,
  LoadingFuture,
  PromiseFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useViewTree(orgId: number): IFuture<ViewTreeData> {
  const apiClient = useApiClient();
  const views = useAppSelector((state) => state.views);
  const dispatch = useAppDispatch();

  const needsLoad = shouldLoad(views.folderList) || shouldLoad(views.viewList);

  useEffect(() => {
    if (needsLoad) {
      dispatch(allItemsLoad());
      apiClient
        .get<ViewTreeData>(`/api/views/tree?orgId=${orgId}`)
        .then((items) => {
          dispatch(allItemsLoaded(items));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsLoad, orgId]);

  if (needsLoad) {
    return new LoadingFuture();
  } else if (
    (views.viewList.isLoading && !views.viewList.loaded) ||
    (views.folderList.isLoading && !views.folderList.loaded)
  ) {
    return new LoadingFuture();
  } else {
    return new ResolvedFuture({
      folders: views.folderList.items.map((item) => item.data!),
      views: views.viewList.items
        .filter((item) => !item.deleted)
        .map((item) => item.data!),
    });
  }
}
