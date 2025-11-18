'use client';

import { Grid } from '@mui/material';
import { ReactNode, useContext, useEffect } from 'react';

import messageIds from '../l10n/messageIds';
import PersonDetailsCard from './PersonDetailsCard';
import PersonJourneysCard from './PersonJourneysCard';
import PersonOrganizationsCard from './PersonOrganizationsCard';
import PersonLngLatMap from './PersonLngLatMap';
import { TagManagerSection } from 'features/tags/components/TagManager';
import { fieldsLoaded } from '../store';
import { journeysLoaded } from 'features/journeys/store';
import { personLoaded } from '../store';
import { personTagsLoaded } from 'features/tags/store';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useTagging from 'features/tags/hooks/useTagging';
import {
  ZetkinAppliedTag,
  ZetkinCustomField,
  ZetkinJourney,
  ZetkinPerson,
} from 'utils/types/zetkin';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

interface PersonProfileWithInitialDataProps {
  customFields: ZetkinCustomField[];
  journeys: ZetkinJourney[];
  orgId: number;
  person: ZetkinPerson;
  personId: number;
  personTags: ZetkinAppliedTag[];
}

/**
 * Wrapper around Person Profile page that pre-populates Redux store
 * with server-fetched person data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function PersonProfileWithInitialData({
  customFields,
  journeys,
  orgId,
  person,
  personId,
  personTags,
}: PersonProfileWithInitialDataProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { assignToPerson, removeFromPerson } = useTagging(orgId);

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    dispatch(personLoaded([personId, person]));
    dispatch(fieldsLoaded(customFields));
    dispatch(personTagsLoaded([personId, personTags]));
    dispatch(journeysLoaded(journeys));
  }, [customFields, dispatch, journeys, person, personId, personTags]);

  return (
    <Grid container direction="row" spacing={6}>
      <Grid size={12}>
        <PersonLngLatMap
          customFields={customFields}
          height="30vh"
          person={person}
        />
      </Grid>
      <Grid size={{ lg: 4, xs: 12 }}>
        <PersonDetailsCard customFields={customFields} person={person} />
      </Grid>
      <Grid size={{ lg: 4, xs: 12 }}>
        <TagManagerSection
          assignedTags={personTags}
          onAssignTag={async (tag) => {
            try {
              await assignToPerson(personId, tag.id, tag.value);
            } catch (err) {
              showSnackbar('error');
            }
          }}
          onUnassignTag={async (tag) => {
            try {
              await removeFromPerson(personId, tag.id);
            } catch (err) {
              showSnackbar('error');
            }
          }}
          submitCreateTagLabel={messages.tags.createAndApplyLabel()}
        />
      </Grid>
      {!!journeys.length && (
        <Grid size={{ lg: 4, xs: 12 }}>
          <PersonJourneysCard orgId={orgId} personId={personId} />
        </Grid>
      )}
      <Grid size={{ lg: 4, xs: 12 }}>
        <PersonOrganizationsCard orgId={orgId} personId={personId} />
      </Grid>
    </Grid>
  );
}
