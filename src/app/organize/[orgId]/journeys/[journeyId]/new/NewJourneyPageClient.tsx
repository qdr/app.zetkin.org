'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Chip, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import DefaultLayout from 'utils/layout/DefaultLayout';
import Header from 'zui/ZUIHeader';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import messageIds from 'features/journeys/l10n/messageIds';
import { useApiClient } from 'core/hooks';
import useCreateJourneyInstance from 'features/journeys/hooks/useCreateJourneyInstance';
import useJourney from 'features/journeys/hooks/useJourney';
import ZUIAutoTextArea from 'zui/ZUIAutoTextArea';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinAppliedTag,
  ZetkinPerson,
} from 'utils/types/zetkin';

interface NewJourneyPageClientProps {
  orgId: string;
  journeyId: string;
  subjectId?: string;
}

const NewJourneyPageClient: FC<NewJourneyPageClientProps> = ({
  orgId,
  journeyId,
  subjectId,
}) => {
  const [assignees, setAssignees] = useState<ZetkinPerson[]>([]);
  const [subjects, setSubjects] = useState<ZetkinPerson[]>([]);
  const [tags, setTags] = useState<ZetkinAppliedTag[]>([]);
  const [note, setNote] = useState('');
  const [editedNote, setEditedNote] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messages = useMessages(messageIds);
  const theme = useTheme();
  const router = useRouter();

  const apiClient = useApiClient();
  useEffect(() => {
    async function loadSubject() {
      if (subjectId) {
        const person = await apiClient.get<ZetkinPerson>(
          `/api/orgs/${orgId}/people/${subjectId}`
        );
        setSubjects([...subjects, person]);
      }
    }
    loadSubject();
  }, []);

  const journeyFuture = useJourney(parseInt(orgId), parseInt(journeyId));
  const createJourneyInstance = useCreateJourneyInstance(
    parseInt(orgId),
    parseInt(journeyId)
  );

  return (
    <DefaultLayout>
      <ZUIFuture future={journeyFuture}>
        {(journey) => {
          if (!editedNote) {
            setNote(journey.opening_note_template);
          }
          return (
            <>
              <Header
                subtitle={
                  <Box
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <Chip
                      label={messages.instance.newInstance.draft()}
                      style={{
                        backgroundColor: theme.palette.grey['300'],
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                }
                title={
                  <ZUIEditTextinPlace
                    allowEmpty
                    onChange={setTitle}
                    placeholder={messages.instance.newInstance.title({
                      journey: journey.singular_label,
                    })}
                    value={title}
                  />
                }
              />
              <Box p={3}>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid size={{ md: 6 }}>
                    <Typography
                      color="secondary"
                      style={{ marginBottom: '1.5rem' }}
                      variant="h6"
                    >
                      <Msg id={messageIds.instance.newInstance.openingNote} />
                    </Typography>
                    <ZUIAutoTextArea
                      onChange={(value) => {
                        setNote(value);
                        setEditedNote(true);
                      }}
                      value={note}
                    />
                    <form
                      onSubmit={async (ev) => {
                        ev.preventDefault();
                        setIsLoading(true);
                        await createJourneyInstance({
                          assignees,
                          note,
                          subjects,
                          tags,
                          title,
                        });
                        setIsLoading(false);
                      }}
                    >
                      <ZUISubmitCancelButtons
                        onCancel={() => {
                          router.push(`/organize/${orgId}/journeys/${journeyId}`);
                        }}
                        submitDisabled={!editedNote || isLoading}
                        submitText={messages.instance.newInstance.submitLabel({
                          journey: journey.singular_label,
                        })}
                      />
                    </form>
                  </Grid>
                  <Grid size={{ md: 4 }}>
                    <JourneyInstanceSidebar
                      journeyInstance={{
                        assignees,
                        journey,
                        next_milestone: null,
                        subjects,
                        tags,
                      }}
                      onAddAssignee={(person) =>
                        setAssignees([...assignees, person])
                      }
                      onAddSubject={(person) =>
                        setSubjects([...subjects, person])
                      }
                      onAssignTag={(tag) => setTags([...tags, tag])}
                      onRemoveAssignee={(person) =>
                        setAssignees(
                          assignees.filter((assignee) => assignee.id != person.id)
                        )
                      }
                      onRemoveSubject={(person) =>
                        setSubjects(
                          subjects.filter((subject) => subject.id != person.id)
                        )
                      }
                      onTagEdited={(editedTag) => {
                        setTags(
                          tags.map((tag) => {
                            if (tag.id == editedTag.id) {
                              return { ...editedTag, value: tag.value };
                            } else {
                              return tag;
                            }
                          })
                        );
                      }}
                      onUnassignTag={(tagToUnassign) =>
                        setTags(tags.filter((tag) => tag.id != tagToUnassign.id))
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          );
        }}
      </ZUIFuture>
    </DefaultLayout>
  );
};

export default NewJourneyPageClient;
