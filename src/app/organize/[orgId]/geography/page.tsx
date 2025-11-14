'use client';


import SimpleLayout from 'utils/layout/SimpleLayout';
import useAreas from 'features/areas/hooks/useAreas';
import { useParams } from 'next/navigation';
import ZUIFuture from 'zui/ZUIFuture';
import { AREAS } from 'utils/featureFlags';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import GLGeographyMap from 'features/geography/components/GLGeographyMap';



export default GeographyPage;
