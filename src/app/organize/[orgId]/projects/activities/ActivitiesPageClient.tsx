'use client';

import { FC, ChangeEvent, useState } from 'react';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import useActivityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';

interface ActivitiesPageClientProps {
  orgId: number;
}

const ActivitiesPageClient: FC<ActivitiesPageClientProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const activitiesFuture = useActivityList(orgId);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.AREA_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
    ACTIVITIES.EMAIL,
  ]);

  const onFiltersChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const filter = evt.target.value as ACTIVITIES;
    if (filters.includes(filter)) {
      setFilters(filters.filter((a) => a !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const onSearchStringChange = (value: string) => setSearchString(value);

  return (
    <AllCampaignsLayout>
      <Box>
        <ZUIFuture future={activitiesFuture} skeletonWidth={200}>
          {(data) => {
            if (data.length === 0) {
              return (
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects/archive`}
                  linkMessage={messages.allProjects.viewArchive()}
                  message={messages.allProjects.noActivities()}
                />
              );
            }

            const activityTypes = data.map(
              (activity: CampaignActivity) => activity.kind
            );
            const filterTypes = [...new Set(activityTypes)];

            return (
              <Grid container spacing={2}>
                <Grid size={{ sm: 8 }}>
                  <ActivityList
                    allActivities={data}
                    filters={filters}
                    orgId={orgId}
                    searchString={searchString}
                  />
                </Grid>

                <Grid size={{ sm: 4 }}>
                  <FilterActivities
                    filters={filters}
                    filterTypes={filterTypes}
                    onFiltersChange={onFiltersChange}
                    onSearchStringChange={onSearchStringChange}
                  />
                </Grid>
              </Grid>
            );
          }}
        </ZUIFuture>
      </Box>
    </AllCampaignsLayout>
  );
};

export default ActivitiesPageClient;
