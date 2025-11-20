import useViewTree, { ViewTreeReturn } from './useViewTree';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

export interface ViewBrowserFolderItem {
  id: number | string;
  type: 'folder';
  title: string;
  owner: string;
  data: ZetkinViewFolder;
  folderId: number | null;
}

export interface ViewBrowserViewItem {
  id: number | string;
  type: 'view';
  title: string;
  owner: string;
  data: ZetkinView;
  folderId: number | null;
}

export type ViewBrowserBackItem = {
  folderId: number | null;
  id: string;
  title: string | null;
  type: 'back';
};

export type ViewBrowserItem =
  | ViewBrowserFolderItem
  | ViewBrowserViewItem
  | ViewBrowserBackItem;

export interface ViewBrowserItemsReturn {
  items: ViewBrowserItem[];
  hasMore: boolean;
  loadMore: () => void;
}

export default function useViewBrowserItems(
  orgId: number,
  folderId: number | null
): IFuture<ViewBrowserItemsReturn> {
  const treeFuture = useViewTree(orgId);

  if (!treeFuture.data) {
    return new FutureBase(null, treeFuture.error, treeFuture.isLoading);
  }

  const { data, hasMore, loadMore } = treeFuture.data;
  const items: ViewBrowserItem[] = [];

  if (folderId) {
    const folder = data.folders.find(
      (folder) => folder.id == folderId
    );
    if (folder) {
      items.push({
        folderId: folder.parent?.id ?? null,
        id: 'back',
        title: folder.parent?.title ?? null,
        type: 'back',
      });
    }
  }

  data.folders
    .filter((folder) => folder.parent?.id == folderId)
    .forEach((folder) => {
      items.push({
        data: folder,
        folderId: folderId,
        id: 'folders/' + folder.id,
        owner: '',
        title: folder.title,
        type: 'folder',
      });
    });

  data.views
    .filter((view) => {
      if (view) {
        return view.folder?.id == folderId;
      }
    })
    .forEach((view) => {
      items.push({
        data: view,
        folderId: folderId,
        id: 'lists/' + view.id,
        owner: view.owner.name,
        title: view.title,
        type: 'view',
      });
    });

  return new ResolvedFuture({
    items,
    hasMore,
    loadMore,
  });
}
