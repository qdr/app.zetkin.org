'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import uniqBy from 'lodash/uniqBy';

import JoinFormSelect from './JoinFormSelect';
import JoinSubmissionPane from '../panes/JoinSubmissionPane';
import JoinSubmissionTable from './JoinSubmissionTable';
import messageIds from '../l10n/messageIds';
import { submissionsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { usePanes } from 'utils/panes';
import { ZetkinJoinSubmission } from '../types';
import ZUIEmptyState from 'zui/ZUIEmptyState';

interface IncomingPageWithInitialDataProps {
  orgId: number;
  submissions: ZetkinJoinSubmission[];
}

export default function IncomingPageWithInitialData({
  orgId,
  submissions,
}: IncomingPageWithInitialDataProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const { openPane } = usePanes();

  type FilterByStatusType = 'all' | 'pending' | 'accepted';
  const [filterByStatus, setFilterByStatus] =
    useState<FilterByStatusType>('all');
  const [filterByForm, setFilterByForm] = useState<number | undefined>();

  useEffect(() => {
    dispatch(submissionsLoaded(submissions));
  }, [submissions, dispatch]);

  const uniqueForms = uniqBy(
    submissions.map((s) => s.form),
    'id'
  );

  const filteredSubmissions = submissions.filter((submission) => {
    const hasFormMatches =
      filterByForm === undefined || submission.form.id === filterByForm;
    const hasStatusMatches =
      filterByStatus === 'all' || submission.state === filterByStatus;
    return hasFormMatches && hasStatusMatches;
  });

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        justifyContent="flex-end"
        sx={{ mr: 2, my: 2 }}
      >
        <JoinFormSelect
          formId={filterByForm}
          forms={uniqueForms}
          onFormSelect={(form) => setFilterByForm(form?.id)}
        />

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
      {filteredSubmissions.length > 0 ? (
        <JoinSubmissionTable
          onSelect={(submission) => {
            openPane({
              render: () => (
                <JoinSubmissionPane orgId={orgId} submissionId={submission.id} />
              ),
              width: 500,
            });
          }}
          orgId={orgId}
          submissions={filteredSubmissions}
        />
      ) : (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <ZUIEmptyState
            message={messages.submissionList.noFilteringResults()}
            renderIcon={(props) => <InfoOutlinedIcon {...props} />}
          />
        </Box>
      )}
    </>
  );
}
