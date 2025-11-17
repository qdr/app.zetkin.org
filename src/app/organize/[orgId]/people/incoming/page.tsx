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

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        justifyContent="flex-end"
        sx={{ mr: 2, my: 2 }}
      >
        <ZUIFuture
          future={joinSubmissions}
          ignoreDataWhileLoading
          skeleton={<JoinFormSelect />}
        >
          {(submissions) => {
            const uniqueForms = uniqBy(
              submissions.map((s) => s.form),
              'id'
            );
            return (
              <JoinFormSelect
                formId={filterByForm}
                forms={uniqueForms}
                onFormSelect={(form) => setFilterByForm(form?.id)}
              />
            );
          }}
        </ZUIFuture>

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

          if (filteredSubmissions.length > 0) {
            return (
              <JoinSubmissionTable
                onSelect={(submission) => {
                  openPane({
                    render: () => (
                      <JoinSubmissionPane
                        orgId={orgId}
                        submissionId={submission.id}
                      />
                    ),
                    width: 500,
                  });
                }}
                orgId={orgId}
                submissions={filteredSubmissions}
              />
            );
          } else {
            return (
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
            );
          }
        }}
      </ZUIFuture>
    </>
  );
}
