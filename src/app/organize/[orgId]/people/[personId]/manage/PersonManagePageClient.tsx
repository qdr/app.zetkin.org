'use client';

import { FC } from 'react';
import { Grid } from '@mui/material';

import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';

interface PersonManagePageClientProps {
  orgId: number;
  personId: number;
}

const PersonManagePageClient: FC<PersonManagePageClientProps> = ({
  orgId,
  personId,
}) => {
  const { data: person } = usePerson(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <SinglePersonLayout>
      <Grid container direction="row" spacing={6}>
        <Grid size={{ lg: 4 }}>
          <PersonDeleteCard orgId={orgId} person={person} />
        </Grid>
      </Grid>
    </SinglePersonLayout>
  );
};

export default PersonManagePageClient;
