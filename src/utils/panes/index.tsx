'use client';

import { Box } from '@mui/material';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useRef,
} from 'react';

type PaneDef = {
  render: () => ReactNode;
  width: number;
};

type PaneContextData = {
  currentPane: PaneDef | null;
  openPane: (pane: PaneDef) => void;
};

const PaneContext = createContext<PaneContextData>({
  currentPane: null,
  openPane: () => {
    // Default function does nothing, but is overridden
    // in the Provider component where it sets state.
    return undefined;
  },
});

type PaneProviderProps = {
  children: ReactNode;
  fixedHeight: boolean;
};

// TODO: Re-enable full pane functionality after App Router migration is complete
// Temporarily simplified to avoid NextRouter issues during migration
export const PaneProvider: FC<PaneProviderProps> = ({
  children,
  fixedHeight,
}) => {
  const paneRef = useRef<PaneDef | null>(null);

  return (
    <PaneContext.Provider
      value={{
        currentPane: paneRef.current,
        openPane: (pane) => {
          console.warn('PaneProvider.openPane() is temporarily disabled during App Router migration');
          paneRef.current = pane;
        },
      }}
    >
      <Box
        style={{
          height: fixedHeight ? '100%' : 'auto',
          minHeight: '100%',
        }}
      >
        {children}
      </Box>
    </PaneContext.Provider>
  );
};

export function usePanes() {
  const { currentPane, openPane } = useContext(PaneContext);

  return { isOpen: !!currentPane && open, openPane };
}
