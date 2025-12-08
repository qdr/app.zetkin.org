'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/system';
import {
  CalendarMonth,
  GroupWorkOutlined,
  Phone,
} from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUILink from 'zui/components/ZUILink';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';
import { useIntl } from 'react-intl';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';

type Props = {
  callId: number;
  orgId: number;
};

export const PublicCallPage: FC<Props> = ({ callId, orgId }) => {
  const intl = useIntl();
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const callAssignment = useCallAssignment(orgId, callId)?.data;

  const isFullScreen = !isMobile;

  const timeInfo =
    callAssignment?.start_date && callAssignment?.end_date
      ? timeSpanToString(
          new Date(removeOffset(callAssignment.start_date)),
          new Date(removeOffset(callAssignment.end_date)),
          intl
        )
      : callAssignment?.start_date
        ? intl.formatDate(new Date(removeOffset(callAssignment.start_date)), {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : null;

  return (
    <Suspense>
      {callAssignment && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingX: isMobile ? 2 : '',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginTop: isFullScreen ? 3 : '',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
              }}
            >
              <Box
                bgcolor="white"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                gap={2}
                minHeight={isFullScreen ? 400 : ''}
                padding={2}
                width="100%"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <ZUIText variant="headingLg">
                    {callAssignment.title || messages.defaultTitles.callAssignment()}
                  </ZUIText>
                </Box>

                {callAssignment.description && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <ZUIText>{callAssignment.description}</ZUIText>
                  </Box>
                )}

                <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2}>
                  {callAssignment.campaign && (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIIcon icon={GroupWorkOutlined} />
                      <ZUIText>
                        <Msg
                          id={messageIds.eventPage.partOfProject}
                          values={{
                            projectLink: (
                              <ZUILink
                                href={`/o/${orgId}/projects/${callAssignment.campaign.id}`}
                                text={callAssignment.campaign.title}
                              />
                            ),
                          }}
                        />
                      </ZUIText>
                    </Box>
                  )}
                  {timeInfo && (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIIcon icon={CalendarMonth} />
                      <ZUIText>{timeInfo}</ZUIText>
                    </Box>
                  )}
                  <Box alignItems="center" display="flex" gap={1}>
                    <ZUIIcon icon={Phone} />
                    <ZUIText>
                      <Msg id={messageIds.callPage.callAssignment} />
                    </ZUIText>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <ZUIButton
                    href={`/call/${callId}`}
                    label={messages.activityList.actions.call()}
                    size="large"
                    variant="primary"
                  />
                </Box>

                {callAssignment.instructions && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      paddingTop: 2,
                    }}
                  >
                    <ZUIText variant="bodyMdSemiBold">
                      <Msg id={messageIds.callPage.instructions} />
                    </ZUIText>
                    <ZUIText>{callAssignment.instructions}</ZUIText>
                  </Box>
                )}
              </Box>
            </Box>
            <ZUIPublicFooter />
          </Box>
        </Box>
      )}
    </Suspense>
  );
};
