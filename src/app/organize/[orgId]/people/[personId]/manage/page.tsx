'use client';

import { Grid } from '@mui/material';

import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/singleperson/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIFuture from 'zui/ZUIFuture';

export const metadata = {
  title: 'Manage Person - Zetkin',
};

export default function PersonManagePage() {
  const onServer = useServerSide();
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const personId = parseInt(params.personId as string);
  const personFuture = usePerson(orgId, personId);

  if (onServer) {
    return null;
  }

  return (
    <SinglePersonLayout>
      <ZUIFuture future={personFuture}>
        {(person) => (
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PersonOrganizationsCard person={person} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PersonDeleteCard person={person} />
            </Grid>
          </Grid>
        )}
      </ZUIFuture>
    </SinglePersonLayout>
  );
}
