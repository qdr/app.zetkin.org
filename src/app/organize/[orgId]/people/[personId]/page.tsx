'use client';

import { Grid } from '@mui/material';
import { useContext } from 'react';

import BackendApiClient from 'core/api/client/BackendApiClient';
import messageIds from 'features/profile/l10n/messageIds';
import PersonDetailsCard from 'features/profile/components/PersonDetailsCard';
import PersonJourneysCard from 'features/profile/components/PersonJourneysCard';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import useTagging from 'features/tags/hooks/useTagging';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { ZetkinPerson } from 'utils/types/zetkin';
import PersonLngLatMap from 'features/profile/components/PersonLngLatMap';

