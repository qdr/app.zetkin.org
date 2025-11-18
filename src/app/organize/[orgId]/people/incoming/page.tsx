'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import uniqBy from 'lodash/uniqBy';

import JoinFormSelect from 'features/joinForms/components/JoinFormSelect';
import JoinSubmissionPane from 'features/joinForms/panes/JoinSubmissionPane';
import JoinSubmissionTable from 'features/joinForms/components/JoinSubmissionTable';
import messageIds from '../../../../../features/joinForms/l10n/messageIds';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { usePanes } from 'utils/panes';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';

type FilterByStatusType = 'all' | 'pending' | 'accepted';

export default function IncomingPage() {
  const { orgId } = useNumericRouteParams();
  const joinSubmissions = useJoinSubmissions(orgId);
  const messages = useMessages(messageIds);

  const [filterByStatus, setFilterByStatus] =
    useState<FilterByStatusType>('all');
  const [filterByForm, setFilterByForm] = useState<number | undefined>();
  const { openPane } = usePanes();
import { getServerApiClient } from 'core/api/server';
import IncomingPageClient from './IncomingPageClient';
import { ZetkinJoinSubmission } from 'features/joinForms/types';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function IncomingPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{messages.status()}</InputLabel>
          <Select
            label={messages.status()}
            onChange={(event) => {
              setFilterByStatus(event.target.value as FilterByStatusType);
            }}
            value={filterByStatus}
          >
            <MenuItem selected value="all">
              {messages.submissionPane.allStatuses()}
            </MenuItem>
            <MenuItem value="pending">{messages.states.pending()}</MenuItem>
            <MenuItem value="accepted">{messages.states.accepted()}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ZUIFuture
        future={joinSubmissions}
        ignoreDataWhileLoading
        skeleton={
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        }
      >
        {(submissions) => {
          const filteredSubmissions = submissions.filter((submission) => {
            const hasFormMatches =
              filterByForm === undefined || submission.form.id === filterByForm;
            const hasStatusMatches =
              filterByStatus === 'all' || submission.state === filterByStatus;
            return hasFormMatches && hasStatusMatches;
          });
  const apiClient = await getServerApiClient();

  const submissions = await apiClient.get<ZetkinJoinSubmission[]>(
    `/api/orgs/${orgId}/join_submissions`
  );

  return <IncomingPageClient orgId={orgId} submissions={submissions} />;
}
