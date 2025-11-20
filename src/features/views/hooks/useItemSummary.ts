import useViewTree from './useViewTree';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

export default function useItemSummary(
  orgId: number,
  folderId: number | null
): IFuture<{ folders: number; views: number }> {
  const treeFuture = useViewTree(orgId);

  if (!treeFuture.data) {
    return new FutureBase(null, treeFuture.error, treeFuture.isLoading);
  }

  const { data } = treeFuture.data;

  return new ResolvedFuture({
    folders: data.folders.filter(
      (folder) => folder.parent?.id == folderId
    ).length,
    views: data.views.filter((view) => {
      if (view) {
        return view.folder?.id == folderId;
      }
    }).length,
  });
}
