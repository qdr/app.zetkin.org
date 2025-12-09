'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/system';
import {
  CalendarMonth,
  GroupWorkOutlined,
  Map,
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
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useCampaign from 'features/campaigns/hooks/useCampaign';

type Props = {
  canvassId: number;
  orgId: number;
};

export const PublicCanvassPage: FC<Props> = ({ canvassId, orgId }) => {
  const intl = useIntl();
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const areaAssignment = useAreaAssignment(orgId, canvassId)?.data;
  const campaign = useCampaign(orgId, areaAssignment?.project_id);

  const isFullScreen = !isMobile;

  const timeInfo =
    areaAssignment?.start_date && areaAssignment?.end_date
      ? timeSpanToString(
          new Date(removeOffset(areaAssignment.start_date)),
          new Date(removeOffset(areaAssignment.end_date)),
          intl
        )
      : areaAssignment?.start_date
        ? intl.formatDate(new Date(removeOffset(areaAssignment.start_date)), {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : null;

  const hasInstructions = !!areaAssignment?.instructions;

  return (
    <Suspense>
      {areaAssignment && (
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
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
              }}
            >
              {hasInstructions && (
                <Box
                  bgcolor="white"
                  borderRadius={2}
                  minHeight={isFullScreen ? 400 : ''}
                  padding={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: isFullScreen ? '60%' : '100%',
                  }}
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    <ZUIText variant="bodyMdSemiBold">
                      <Msg id={messageIds.canvassPage.instructions} />
                    </ZUIText>
                    <ZUIText>{areaAssignment.instructions}</ZUIText>
                  </Box>
                </Box>
              )}
              <Box
                bgcolor="white"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                gap={2}
                minHeight={isFullScreen ? 400 : ''}
                padding={2}
                width={isFullScreen && hasInstructions ? '40%' : '100%'}
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <ZUIText variant="headingLg">
                    {areaAssignment.title || messages.defaultTitles.areaAssignment()}
                  </ZUIText>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <ZUIButton
                    href={`/canvass/${canvassId}`}
                    label={messages.activityList.actions.areaAssignment()}
                    size="large"
                    variant="primary"
                  />
                </Box>

                <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2}>
                  {campaign.campaignFuture.data && (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIIcon icon={GroupWorkOutlined} />
                      <ZUIText>
                        <Msg
                          id={messageIds.eventPage.partOfProject}
                          values={{
                            projectLink: (
                              <ZUILink
                                href={`/o/${orgId}/projects/${areaAssignment.project_id}`}
                                text={campaign.campaignFuture.data.title}
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
                    <ZUIIcon icon={Map} />
                    <ZUIText>
                      <Msg id={messageIds.canvassPage.areaAssignment} />
                    </ZUIText>
                  </Box>
                </Box>
              </Box>
            </Box>
            <ZUIPublicFooter />
          </Box>
        </Box>
      )}
    </Suspense>
  );
};
