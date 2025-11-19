'use client';

import { useState, useEffect } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import messageIds from '../l10n/messageIds';
import SurveyEditor from './SurveyEditor';
import { statsLoaded, surveyLoaded } from '../store';
import { SurveyStats } from '../rpc/getSurveyStats';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import ZUILockCard from 'zui/ZUILockCard';

interface QuestionsWithInitialDataProps {
  campId: number | string;
  orgId: number;
  stats: SurveyStats;
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function QuestionsWithInitialData({
  campId,
  orgId,
  stats,
  survey,
  surveyId,
}: QuestionsWithInitialDataProps) {
  const dispatch = useAppDispatch();
  const [forceEditable, setForceEditable] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isShared = campId === 'shared';
  const messages = useMessages(messageIds);

  useEffect(() => {
    dispatch(surveyLoaded(survey));
    dispatch(statsLoaded([surveyId, stats]));
  }, [survey, stats, surveyId, dispatch]);

  const now = dayjs();
  const today = now.format('YYYY-MM-DD');
  const surveyStart = dayjs(survey.published).format('YYYY-MM-DD');
  const surveyEnd = dayjs(survey.expires).format('YYYY-MM-DD');

  const isActive =
    surveyEnd && surveyStart ? surveyStart <= today && today <= surveyEnd : false;

  const receivingSubmissions = stats.submissionCount > 0;
  const isEditingLocked = receivingSubmissions || isActive;

  return (
    <Grid
      container
      direction={isMobile ? 'column-reverse' : undefined}
      spacing={2}
    >
      <Grid size={{ md: 8, xs: 12 }}>
        <SurveyEditor
          orgId={orgId}
          readOnly={(isEditingLocked && !forceEditable) || isShared}
          surveyId={surveyId}
        />
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        {isEditingLocked && !isShared && (
          <ZUILockCard
            isActive={forceEditable}
            lockedHeader={messages.editWarning.locked.header()}
            lockedSubheader={messages.editWarning.locked.subheader()}
            onToggle={(newValue) => setForceEditable(newValue)}
            tips={{
              safe: {
                bullets: [
                  messages.editWarning.editing.safe.bullet1(),
                  messages.editWarning.editing.safe.bullet2(),
                  messages.editWarning.editing.safe.bullet3(),
                  messages.editWarning.editing.safe.bullet4(),
                ],
                header: messages.editWarning.editing.safe.header(),
                iconType: 'check',
              },
              unsafe: {
                bullets: [
                  messages.editWarning.editing.unsafe.bullet1(),
                  messages.editWarning.editing.unsafe.bullet2(),
                ],
                header: messages.editWarning.editing.unsafe.header(),
                iconType: 'close',
              },
            }}
            unlockedHeader={messages.editWarning.editing.header()}
            unlockedSubheader={messages.editWarning.editing.subheader()}
          />
        )}
      </Grid>
    </Grid>
  );
}
