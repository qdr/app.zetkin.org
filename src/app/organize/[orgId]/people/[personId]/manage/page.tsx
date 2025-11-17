'use client';

import { Grid } from '@mui/material';

import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import usePerson from 'features/profile/hooks/usePerson';
import { useNumericRouteParams } from 'core/hooks';

const PersonManagePage = () => {
  const { orgId, personId } = useNumericRouteParams();
  const { data: person } = usePerson(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <>
            <Grid container direction="row" spacing={6}>
        <Grid size={{ lg: 4 }}>
          <PersonDeleteCard orgId={orgId} person={person} />
        </Grid>
      </Grid>
    </>
  );
};

export default PersonManagePage;
