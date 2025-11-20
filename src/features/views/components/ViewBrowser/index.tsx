'use client';

import NextLink from 'next/link';
import {
  DataGridPro,
  GridColDef,
  GridRowProps,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { FC, MouseEvent, useContext, useEffect, useState } from 'react';
import { Box, Button, Link, Theme, useMediaQuery } from '@mui/material';

import BrowserDraggableItem from './BrowserDragableItem';
import BrowserDragLayer from './BrowserDragLayer';
import BrowserItem from './BrowserItem';
import BrowserItemIcon from './BrowserItemIcon';
import BrowserRow from './BrowserRow';
import useFolder from 'features/views/hooks/useFolder';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from 'features/views/hooks/useViewBrowserMutations';
import useViewMutations from 'features/views/hooks/useViewMutations';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import useViewBrowserItems, {
  ViewBrowserItem,
} from 'features/views/hooks/useViewBrowserItems';
import messageIds from 'features/views/l10n/messageIds';
import MoveViewDialog from '../MoveViewDialog';

interface ViewBrowserProps {
  autoHeight?: boolean; // @deprecated
  basePath: string;
  enableDragAndDrop?: boolean;
  enableEllipsisMenu?: boolean;
  folderId?: number | null;
  onSelect?: (item: ViewBrowserItem, ev: MouseEvent) => void;
}

const TYPE_SORT_ORDER = ['back', 'folder', 'view'];

function typeComparator(v0: ViewBrowserItem, v1: ViewBrowserItem): number {
  const index0 = TYPE_SORT_ORDER.indexOf(v0.type);
  const index1 = TYPE_SORT_ORDER.indexOf(v1.type);
  return index0 - index1;
}

const ViewBrowser: FC<ViewBrowserProps> = ({
  autoHeight = true,
  basePath,
  enableDragAndDrop = true,
  enableEllipsisMenu = true,
  folderId = null,
  onSelect,
}) => {
  const { orgId } = useNumericRouteParams();

  const messages = useMessages(messageIds);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'title', sort: 'asc' },
  ]);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const gridApiRef = useGridApiRef();

  const { deleteView, duplicateView } = useViewMutations(orgId);
  const { renameItem } = useViewBrowserMutations(orgId);
  const itemsFuture = useViewBrowserItems(orgId, folderId);
  const { deleteFolder, recentlyCreatedFolder } = useFolder(orgId);

  const [itemToBeMoved, setItemToBeMoved] = useState<ViewBrowserItem | null>(
    null
  );

  // If a folder was created, go into rename state
  useEffect(() => {
    if (gridApiRef.current && recentlyCreatedFolder) {
      gridApiRef.current.startCellEditMode({
        field: 'title',
        id: 'folders/' + recentlyCreatedFolder.id,
      });
    }
  }, [recentlyCreatedFolder]);

  const colDefs: GridColDef<ViewBrowserItem>[] = [
    {
      disableColumnMenu: true,
      field: 'icon',
      filterable: false,
      headerName: '',
      renderCell: (params) => {
        const item = params.row;
        const subPath = item.folderId ? 'folders/' + item.folderId : '';
        if (item.type == 'back') {
          return (
            <NextLink href={`${basePath}/${subPath}`} legacyBehavior passHref>
              <Link color="inherit" onClick={(ev) => onSelect?.(item, ev)}>
                <BrowserItemIcon item={params.row} />
              </Link>
            </NextLink>
          );
        } else {
          return (
            <NextLink href={`${basePath}/${item.id}`} legacyBehavior passHref>
              <Link color="inherit" onClick={(ev) => onSelect?.(item, ev)}>
                <BrowserDraggableItem item={params.row}>
                  <BrowserItemIcon item={params.row} />
                </BrowserDraggableItem>
              </Link>
            </NextLink>
          );
        }
      },
      sortable: false,
      width: 40,
    },
    {
      disableColumnMenu: true,
      editable: true,
      field: 'title',
      flex: 2,
      headerName: messages.viewsList.columns.title(),
      renderCell: (params) => {
        const item = params.row;
        return (
          <BrowserItem
            basePath={basePath}
            item={params.row}
            onClick={(ev) => {
              onSelect?.(item, ev);
            }}
          />
        );
      },
    },
  ];

  if (!isMobile) {
    colDefs.push({
      disableColumnMenu: true,
      field: 'date',
      flex: 0.8,
      headerName: 'Date',
      renderCell: (params) => {
        if (params.row.type == 'view' && params.row.date) {
          // Format as yyyy-mm-dd
          const date = new Date(params.row.date);
          return date.toISOString().split('T')[0];
        }
        return '';
      },
    });

    colDefs.push({
      disableColumnMenu: true,
      field: 'owner',
      flex: 1,
      headerName: messages.viewsList.columns.owner(),
      renderCell: (params) => {
        if (params.row.type == 'view') {
          const owner = params.row.data.owner;
          return (
            <ZUIPersonHoverCard personId={owner.id}>
              <ZUIPerson id={owner.id} name={owner.name} />
            </ZUIPersonHoverCard>
          );
        } else {
          return '';
        }
      },
    });

    if (enableEllipsisMenu) {
      colDefs.push({
        field: 'menu',
        headerName: '',
        renderCell: (params) => {
          const item = params.row;
          if (item.type == 'back') {
            return null;
          }
          return (
            <ZUIEllipsisMenu
              items={[
                {
                  label: messages.browser.menu.rename(),
                  onSelect: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    gridApiRef.current.startCellEditMode({
                      field: 'title',
                      id: params.row.id,
                    });
                  },
                },
                {
                  id: 'delete-item',
                  label: messages.browser.menu.delete(),
                  onSelect: (e) => {
                    e.stopPropagation();
                    showConfirmDialog({
                      onSubmit: () => {
                        if (item.type == 'folder') {
                          deleteFolder(item.data.id);
                        } else if (params.row.type == 'view') {
                          deleteView(item.data.id);
                        }
                      },
                      title: messages.browser.confirmDelete[item.type].title(),
                      warningText:
                        messages.browser.confirmDelete[item.type].warning(),
                    });
                  },
                },
                {
                  id: 'move-item',
                  label: messages.browser.menu.move(),
                  onSelect: (e) => {
                    e.stopPropagation();
                    setItemToBeMoved(item);
                  },
                },
                {
                  disabled: item.type != 'view',
                  id: 'duplicate-item',
                  label: messages.browser.menu.duplicate(),
                  onSelect: (e) => {
                    e.stopPropagation();
                    duplicateView(
                      item.data.id,
                      item.folderId,
                      messages.browser.menu.viewCopy({ viewName: item.title })
                    );
                  },
                },
              ]}
            />
          );
        },
        width: 40,
      });
    }
  }

  return (
    <ZUIFuture future={itemsFuture}>
      {(browserData) => {
        const { items, hasMore, loadMore } = browserData;

        // Separate items by type
        const backItems = items.filter(item => item.type === 'back');
        const folderItems = items.filter(item => item.type === 'folder');
        const viewItems = items.filter(item => item.type === 'view');

        // Sort folders within themselves
        const sortedFolders = folderItems.sort((item0, item1) => {
          for (const column of sortModel) {
            let sort = 0;
            if (column.field == 'title') {
              sort = item0.title.localeCompare(item1.title);
            } else if (column.field == 'owner') {
              sort = item0.owner.localeCompare(item1.owner);
            } else if (column.field == 'date') {
              // Folders don't have dates, so they're equal
              sort = 0;
            }

            if (sort != 0) {
              return column.sort == 'asc' ? sort : -sort;
            }
          }
          return 0;
        });

        // For views: always preserve server order (sorted by creation date)
        // This ensures newly loaded items appear at the bottom
        const sortedViews = viewItems;

        // Combine in correct order: back button, folders, then views in server order
        const rows = [...backItems, ...sortedFolders, ...sortedViews];

        return (
          <>
            {enableDragAndDrop && <BrowserDragLayer />}
            <DataGridPro
              apiRef={gridApiRef}
              autoHeight={autoHeight}
              columns={colDefs}
              disableRowSelectionOnClick
              hideFooter
              isCellEditable={(params) => params.row.type != 'back'}
              onSortModelChange={(model) => setSortModel(model)}
              processRowUpdate={(item) => {
                if (item.type != 'back') {
                  renameItem(item.type, item.data.id, item.title);
                }
                return item;
              }}
              rows={rows}
              slots={{
                row: (props: GridRowProps) => {
                  const item = props.row as ViewBrowserItem;
                  return <BrowserRow item={item} rowProps={props} />;
                },
              }}
              sortingMode="server"
              sx={{ borderWidth: 0 }}
            />
            {hasMore && (
              <Box display="flex" justifyContent="center" mt={2} mb={2}>
                <Button
                  onClick={loadMore}
                  variant="outlined"
                >
                  Load more
                </Button>
              </Box>
            )}
            {itemToBeMoved && (
              <MoveViewDialog
                close={() => setItemToBeMoved(null)}
                itemToMove={itemToBeMoved}
              />
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default ViewBrowser;
