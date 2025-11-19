'use client';

import { FC, useContext } from 'react';
import { Grid } from '@mui/material';

import PersonDetailsCard from 'features/profile/components/PersonDetailsCard';
import PersonJourneysCard from 'features/profile/components/PersonJourneysCard';
import PersonLngLatMap from 'features/profile/components/PersonLngLatMap';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import useTagging from 'features/tags/hooks/useTagging';
import messageIds from 'features/profile/l10n/messageIds';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

interface PersonPageClientProps {
  orgId: number;
  personId: number;
}

const PersonPageClient: FC<PersonPageClientProps> = ({ orgId, personId }) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { assignToPerson, removeFromPerson } = useTagging(orgId);
  const fieldsFuture = useCustomFields(orgId);
  const personFuture = usePerson(orgId, personId);
  const person = personFuture.data;
  const personTagsFuture = usePersonTags(orgId, personId);
  const journeysFuture = useJourneys(orgId);

  if (!person) {
    return null;
  }

  return (
    <SinglePersonLayout>
      <Grid container direction="row" spacing={6}>
        <Grid size={12}>
          <ZUIFuture future={fieldsFuture}>
            {(fields) => (
              <PersonLngLatMap
                customFields={fields}
                height="30vh"
                person={person}
              />
            )}
          </ZUIFuture>
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ZUIFuture future={fieldsFuture}>
            {(fields) => (
              <PersonDetailsCard customFields={fields} person={person} />
            )}
          </ZUIFuture>
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ZUIFuture future={personTagsFuture}>
            {(personTags) => (
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
            )}
          </ZUIFuture>
        </Grid>
        {!!journeysFuture.data?.length && (
          <Grid size={{ lg: 4, xs: 12 }}>
            <PersonJourneysCard orgId={orgId} personId={personId} />
          </Grid>
        )}
        <Grid size={{ lg: 4, xs: 12 }}>
          <PersonOrganizationsCard orgId={orgId} personId={personId} />
        </Grid>
      </Grid>
    </SinglePersonLayout>
  );
};

export default PersonPageClient;
