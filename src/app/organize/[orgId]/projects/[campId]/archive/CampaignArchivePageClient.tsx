'use client';

import { FC, ChangeEvent, useState } from 'react';
import { Box, Grid } from '@mui/material';

import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useActivityArchive from 'features/campaigns/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';

interface CampaignArchivePageClientProps {
  orgId: number;
  campId: number;
}

const CampaignArchivePageClient: FC<CampaignArchivePageClientProps> = ({
  orgId,
  campId,
}: CampaignArchivePageClientProps) => {
  const messages = useMessages(messageIds);
  const archivedActivities = useActivityArchive(orgId, campId);
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
      setFilters(filters.filter((a: ACTIVITIES) => a !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const onSearchStringChange = (value: string) => setSearchString(value);

  return (
    <SingleCampaignLayout>
      <Box>
        <ZUIFuture future={archivedActivities}>
          {(data: CampaignActivity[]) => {
            if (data.length === 0) {
              return (
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects/${campId}/activities`}
                  linkMessage={messages.activitiesOverview.goToActivities()}
                  message={messages.singleProject.noActivities()}
                />
              );
            }

            const activityTypes = data?.map(
              (activity: CampaignActivity) => activity.kind
            );
            const filterTypes = [...new Set(activityTypes)] as ACTIVITIES[];

            return (
              <Grid container spacing={2}>
                <Grid size={{ sm: 8 }}>
                  <ActivityList
                    allActivities={data}
                    filters={filters}
                    orgId={orgId}
                    searchString={searchString}
                    sortNewestFirst
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
    </SingleCampaignLayout>
  );
};

export default CampaignArchivePageClient;
