'use client';

import { FC, Fragment, useMemo } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { isAllDay } from 'features/calendar/components/utils';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

type ZUITimeSpanProps = {
  end: Date;
  start: Date;
};

const ZUITimeSpan: FC<ZUITimeSpanProps> = ({ end, start }) => {
  // Memoize "today" to prevent hydration mismatches and avoid recalculating on every render
  const today = useMemo(() => new Date().toDateString(), []);

  const isToday = start.toDateString() === today;
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === today;

  const startTime = <FormattedTime key="start-time" value={start} />;
  const endTime = <FormattedTime key="end-time" value={end} />;

  const startDate = (
    <FormattedDate key="start-date" dateStyle="medium" value={start} />
  );
  const endDate = (
    <FormattedDate key="end-date" dateStyle="medium" value={end} />
  );

  if (isToday && isAllDay(start.toISOString(), end.toDateString())) {
    return <Msg id={messageIds.timeSpan.singleDayAllDay} />;
  }

  return (
    <>
      {isToday && (
        <Fragment key="today">
          {endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.singleDayToday}
              values={{ end: endTime, start: startTime }}
            />
          )}
          {!endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.multiDayToday}
              values={{
                end: endTime,
                endDate: endDate,
                start: startTime,
              }}
            />
          )}
        </Fragment>
      )}
      {!isToday && (
        <Fragment key="not-today">
          {endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.singleDay}
              values={{
                date: startDate,
                end: endTime,
                start: startTime,
              }}
            />
          )}
          {!endsOnSameDay && (
            <Fragment key="multi-day">
              {endsOnToday && (
                <Msg
                  id={messageIds.timeSpan.multiDayEndsToday}
                  values={{
                    end: endTime,
                    start: startTime,
                    startDate: startDate,
                  }}
                />
              )}
              {!endsOnToday && (
                <Msg
                  id={messageIds.timeSpan.multiDay}
                  values={{
                    end: endTime,
                    endDate: endDate,
                    start: startTime,
                    startDate: startDate,
                  }}
                />
              )}
            </Fragment>
          )}
        </Fragment>
      )}
    </>
  );
};

export default ZUITimeSpan;
