import { FC, useMemo } from 'react';
import { FormattedDate } from 'react-intl';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import useSurveyStats from '../hooks/useSurveyStats';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type SubmissionChartCardProps = {
  orgId: number;
  surveyId: number;
};

const SubmissionChartCard: FC<SubmissionChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const statsFuture = useSurveyStats(orgId, surveyId);

  return (
    <ZUIFuture future={statsFuture}>
      {(data) => {
        // DEBUG: Log what we're receiving
        console.log('[SubmissionChartCard] Data received:', {
          data,
          hasData: !!data,
          dataType: typeof data,
          hasSubmissionsByDay: data
            ? 'submissionsByDay' in data
            : 'data is falsy',
          submissionsByDayType: data?.submissionsByDay
            ? typeof data.submissionsByDay
            : 'undefined',
          isArray: data?.submissionsByDay
            ? Array.isArray(data.submissionsByDay)
            : false,
          length: data?.submissionsByDay?.length,
        });

        // Early return if data is completely missing
        if (!data || typeof data !== 'object') {
          console.log('[SubmissionChartCard] No valid data, showing placeholder');
          return (
            <ZUICard header={messages.chart.header()}>
              <Box height={400}>
                <Box
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  justifyContent="center"
                  width="100%"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom={2}
                    width="100%"
                  >
                    <PlaceholderVisual />
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.disabled,
                      textAlign: 'center',
                    }}
                  >
                    <Msg id={messageIds.chart.placeholder} />
                  </Typography>
                </Box>
              </Box>
            </ZUICard>
          );
        }

        // Defensive: filter out invalid items instead of hiding the entire card
        // This way we show the placeholder when there's no valid data
        const submissionCount =
          typeof data.submissionCount === 'number' ? data.submissionCount : 0;
        const chartSurveyId = typeof data.id === 'number' ? data.id : surveyId;

        // Use the raw submissionsByDay array if valid, empty array otherwise
        const submissionsByDay =
          data.submissionsByDay && Array.isArray(data.submissionsByDay)
            ? data.submissionsByDay
            : [];

        // Extra validation: ensure all items in the array are valid
        const validSubmissionsByDay = submissionsByDay.filter(
          (day) =>
            day &&
            typeof day === 'object' &&
            day.date &&
            typeof day.accumulatedSubmissions === 'number'
        );

        const hasChartData = validSubmissionsByDay.length > 1;

        // Memoize the chart data to prevent Nivo from receiving unstable references
        // during React Strict Mode's double rendering
        const chartData = useMemo(() => {
          if (!hasChartData) return [];

          return [
            {
              data: validSubmissionsByDay.map((day) => ({
                x: day.date,
                y: day.accumulatedSubmissions,
              })),
              id: chartSurveyId,
            },
          ];
        }, [hasChartData, validSubmissionsByDay, chartSurveyId]);

        console.log('[SubmissionChartCard] Chart rendering:', {
          submissionCount,
          chartSurveyId,
          originalLength: submissionsByDay.length,
          validLength: validSubmissionsByDay.length,
          hasChartData,
          chartDataLength: chartData.length,
          firstItem: validSubmissionsByDay[0],
          lastItem: validSubmissionsByDay[validSubmissionsByDay.length - 1],
        });

        return (
          <ZUICard
            header={messages.chart.header()}
            status={
              !!submissionCount && (
                <ZUINumberChip
                  color={theme.palette.grey[200]}
                  value={submissionCount}
                />
              )
            }
            subheader={
              submissionCount
                ? messages.chart.subheader({
                    days: validSubmissionsByDay.length,
                  })
                : undefined
            }
          >
            <Box height={400}>
              {!hasChartData && (
                <Box
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  justifyContent="center"
                  width="100%"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom={2}
                    width="100%"
                  >
                    <PlaceholderVisual />
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.disabled,
                      textAlign: 'center',
                    }}
                  >
                    <Msg id={messageIds.chart.placeholder} />
                  </Typography>
                </Box>
              )}
              {hasChartData && (
                <ResponsiveLine
                  animate={false}
                  axisBottom={{
                    format: '%b %d',
                  }}
                  colors={[theme.palette.primary.main]}
                  curve="basis"
                  data={chartData}
                  defs={[
                    linearGradientDef('gradientA', [
                      { color: 'inherit', offset: 0 },
                      { color: 'inherit', offset: 100, opacity: 0 },
                    ]),
                  ]}
                  enableArea={true}
                  enableGridX={false}
                  enableGridY={false}
                  enablePoints={false}
                  enableSlices="x"
                  fill={[{ id: 'gradientA', match: '*' }]}
                  isInteractive={true}
                  lineWidth={3}
                  margin={{
                    bottom: 20,
                    // Calculate the left margin from the number of digits
                    // in the submission count, to make sure the axis labels
                    // will fit inside the clipping rectangle.
                    left: 8 + submissionCount.toString().length * 8,
                    top: 20,
                  }}
                  sliceTooltip={(props) => {
                    // Defensive: check if points array exists and has items
                    if (
                      !props.slice?.points ||
                      !Array.isArray(props.slice.points) ||
                      props.slice.points.length === 0
                    ) {
                      return null;
                    }

                    const dataPoint = props.slice.points[0];
                    if (!dataPoint?.data?.xFormatted) {
                      return null;
                    }

                    const date = new Date(dataPoint.data.xFormatted);

                    return (
                      <Paper>
                        <Box p={1}>
                          <Typography variant="h6">
                            <FormattedDate value={date} />
                          </Typography>
                          <Typography variant="body2">
                            <Msg
                              id={messageIds.chart.tooltip.submissions}
                              values={{ count: dataPoint.data.y as number }}
                            />
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  }}
                  xFormat="time:%Y-%m-%d"
                  xScale={{
                    format: '%Y-%m-%d',
                    precision: 'day',
                    type: 'time',
                  }}
                />
              )}
            </Box>
          </ZUICard>
        );
      }}
    </ZUIFuture>
  );
};

const PlaceholderVisual: FC = () => {
  return (
    <svg
      fill="none"
      height="167"
      viewBox="0 0 851 167"
      width="851"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 165.5C3 165.5 185.485 -117.14 424.243 61.946C663 241.032 849 61.7515 849 61.7515"
        stroke="black"
        strokeDasharray="10 30"
        strokeOpacity="0.15"
        strokeWidth="5"
      />
    </svg>
  );
};

export default SubmissionChartCard;
