'use client';

import { FC, useState } from 'react';
import { Box, Grid } from '@mui/material';

import { ACTIVITIES } from 'features/campaigns/types';
import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useActivityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';

interface CampaignActivitiesPageClientProps {
  orgId: number;
  campId: number;
}

const CampaignActivitiesPageClient: FC<CampaignActivitiesPageClientProps> = ({ orgId, campId }) => {
  const messages = useMessages(messageIds);
  const campaignActivitiesFuture = useActivityList(orgId, campId);

  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.AREA_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
    ACTIVITIES.EMAIL,
  ]);

  return (
    <SingleCampaignLayout>
      <Box>
        <ZUIFuture future={campaignActivitiesFuture}>
          {(data) => {
            if (data.length === 0) {
              return (
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects/${campId}/archive`}
                  linkMessage={messages.singleProject.viewArchive()}
                  message={messages.singleProject.noActivities()}
                />
              );
            }

            const activityTypes = data?.map((activity) => activity.kind);
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
                    onFiltersChange={(evt) => {
                      const filter = evt.target.value as ACTIVITIES;
                      if (filters.includes(filter)) {
                        setFilters(filters.filter((a) => a !== filter));
                      } else {
                        setFilters([...filters, filter]);
                      }
                    }}
                    onSearchStringChange={(value) => setSearchString(value)}
                  />
                </Grid>
              </Grid>
            );
          }}
        </ZUIFuture>
      </Box>
    </SingleCampaignLayout>
  );
};

export default CampaignActivitiesPageClient;
