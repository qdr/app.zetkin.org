'use client';

import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import CallAssignmentCallersList from 'features/callAssignments/components/CallAssignmentCallersList';
import {
  callAssignmentLoaded,
  callersLoaded,
} from 'features/callAssignments/store';
import CallerConfigDialog from 'features/callAssignments/components/CallerConfigDialog';
import { CallAssignmentCaller } from 'features/callAssignments/hooks/useCallers';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { useAppDispatch } from 'core/hooks';
import useCallers from 'features/callAssignments/hooks/useCallers';
import zuiMessageIds from 'zui/l10n/messageIds';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

interface CallersPageClientProps {
  callAssId: number;
  callAssignment: ZetkinCallAssignment;
  callers: CallAssignmentCaller[];
  orgId: number;
}

export default function CallersPageClient({
  callAssId,
  callAssignment,
  callers,
  orgId,
}: CallersPageClientProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);

  useEffect(() => {
    dispatch(callAssignmentLoaded(callAssignment));
    dispatch(callersLoaded([callers, callAssId]));
  }, [callAssignment, callers, callAssId, dispatch]);

  const {
    addCaller,
    filteredCallersFuture,
    isCaller,
    removeCaller,
    searchString,
    selectInputRef,
    selectedCaller,
    setCallerTags,
    setSearchString,
    setSelectedCaller,
  } = useCallers(orgId, callAssId);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h4">
              <Msg id={messageIds.callers.title} />
            </Typography>
            <TextField
              InputProps={{
                endAdornment: (
                  <Fade in={searchString.length > 0}>
                    <IconButton onClick={() => setSearchString('')}>
                      <Close />
                    </IconButton>
                  </Fade>
                ),
              }}
              onChange={(evt) => {
                setSearchString(evt.target.value);
              }}
              placeholder={messages.callers.searchBox()}
              value={searchString}
              variant="outlined"
            />
          </Box>
          <CallAssignmentCallersList
            callers={filteredCallersFuture.data || []}
            onCustomize={(caller) => setSelectedCaller(caller)}
            onRemove={(caller) => removeCaller(caller.id)}
          />
        </Box>
      </Paper>
      <Box marginTop={2}>
        <MUIOnlyPersonSelect
          bulkSelection={{
            entityToAddTo: callAssignment?.title,
            onSelectMultiple: (ids) => {
              // TODO #2789: Optimize this, e.g. using RPC
              ids.forEach((id) => {
                if (!isCaller(id)) {
                  addCaller(id);
                }
              });
            },
          }}
          createPersonLabels={{
            submitLabel: zuiMessages.createPerson.submitLabel.add(),
            title: zuiMessages.createPerson.title.caller(),
          }}
          getOptionDisabled={(person) => isCaller(person.id)}
          getOptionExtraLabel={(person) =>
            isCaller(person.id) ? messages.callers.add.alreadyAdded() : ''
          }
          inputRef={selectInputRef}
          onChange={(person) => {
            addCaller(person.id);

            // Blur and re-focus input to reset, so that user can type again to
            // add another person, without taking their hands off the keyboard.
            selectInputRef?.current?.blur();
            selectInputRef?.current?.focus();
          }}
          placeholder={messages.callers.add.placeholder()}
          selectedPerson={null}
        />
      </Box>
      <CallerConfigDialog
        caller={selectedCaller}
        onClose={() => setSelectedCaller(null)}
        onSubmit={(prioTags, excludedTags) => {
          if (selectedCaller) {
            setCallerTags(selectedCaller.id, prioTags, excludedTags);
          }
          setSelectedCaller(null);
        }}
        open={!!selectedCaller}
      />
    </Box>
  );
}
