'use client';

import { FC, ChangeEvent, useState } from 'react';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import SharedActivitiesLayout from 'features/campaigns/layout/SharedActivitiesLayout';
import useAcitvityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';

interface SharedActivitiesPageClientProps {
  orgId: string;
}

const SharedActivitiesPageClient: FC<SharedActivitiesPageClientProps> = ({
  orgId,
}: SharedActivitiesPageClientProps) => {
  const messages = useMessages(messageIds);
  const parsedOrgId = parseInt(orgId);
  const activitiesFuture = useAcitvityList(parsedOrgId, undefined);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
    ACTIVITIES.EMAIL,
    ACTIVITIES.EVENT,
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
    <SharedActivitiesLayout orgId={orgId}>
      <Box>
        <ZUIFuture future={activitiesFuture} skeletonWidth={200}>
          {(activities: CampaignActivity[]) => {
            //It only filters shared surveys for now, but there will be more shared activities in the future.
            const data = activities.filter(
              (item: CampaignActivity) =>
                item.kind === 'survey' &&
                item.data.org_access === 'suborgs' &&
                item.data.organization.id != parsedOrgId
            );
            if (data.length === 0) {
              return (
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects/shared/archive`}
                  linkMessage={messages.allProjects.viewArchive()}
                  message={messages.shared.noActivities()}
                />
              );
            }

            const activityTypes = data.map(
              (activity: CampaignActivity) => activity.kind
            );
            const filterTypes = [...new Set(activityTypes)] as ACTIVITIES[];

            return (
              <Grid container spacing={2}>
                <Grid size={{ sm: 8 }}>
                  <ActivityList
                    allActivities={data}
                    filters={filters}
                    orgId={parsedOrgId}
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
    </SharedActivitiesLayout>
  );
};

export default SharedActivitiesPageClient;
