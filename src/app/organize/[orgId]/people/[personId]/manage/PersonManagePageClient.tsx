'use client';

import { Grid } from '@mui/material';
import { useEffect } from 'react';

import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import { personLoaded } from 'features/profile/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';

interface PersonManagePageClientProps {
  orgId: number;
  person: ZetkinPerson;
  personId: number;
}

export default function PersonManagePageClient({
  orgId,
  person,
  personId,
}: PersonManagePageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(personLoaded([personId, person]));
  }, [person, personId, dispatch]);

  return (
    <Grid container direction="row" spacing={6}>
      <Grid size={{ lg: 4 }}>
        <PersonDeleteCard orgId={orgId} person={person} />
      </Grid>
    </Grid>
  );
}
