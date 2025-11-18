import { isEqualWith } from 'lodash';
import { redirect } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import globalMessageIds from 'core/i18n/messageIds';
import messageIds from 'features/views/l10n/messageIds';
import {
  CallBlockedFilterConfig,
  FILTER_TYPE,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
} from 'features/views/components/types';

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient, headersList } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  const lang = getBrowserLanguage({ headers: Object.fromEntries(headersList.entries()) } as any);
  const messages = await getServerMessages(lang, messageIds);
  const globalMessages = await getServerMessages(lang, globalMessageIds);

  const views = await apiClient.get<ZetkinView[]>(
    `/api/orgs/${orgId}/people/views`
  );

  // Define an Organizer Action View
  const callBlockedFilter: ZetkinSmartSearchFilter<CallBlockedFilterConfig> = {
    config: {
      reason: 'organizer_action_needed',
    },
    type: FILTER_TYPE.CALL_BLOCKED,
  };

  const targetColumns: Pick<ZetkinViewColumn, 'config' | 'type'>[] = [
    {
      config: {
        field: 'first_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    },
    {
      config: {
        field: 'last_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    },
    {
      config: {
        state: 'any',
      },
      type: COLUMN_TYPE.ORGANIZER_ACTION,
    },
  ];

  // Look for a view that matches the definition of an Organizer Action View
  let view = await Promise.all(
    views.map(async (v) => {
      const firstFilter = v.content_query?.filter_spec[0];

      // TODO: Create better types for smart search
      if (firstFilter?.type != FILTER_TYPE.CALL_BLOCKED) {
        return null;
      }

      const filterConfig = firstFilter.config as CallBlockedFilterConfig;

      if (filterConfig.reason == callBlockedFilter.config.reason) {
        // Check the columns
        const columns = await apiClient.get<ZetkinViewColumn[]>(
          `/api/orgs/${orgId}/people/views/${v.id}/columns`
        );
        if (
          targetColumns.every((targetCol): boolean => {
            return columns.some(
              (c: ZetkinViewColumn) =>
                c.type == targetCol.type &&
                isEqualWith(targetCol.config, c.config)
            );
          })
        ) {
          return v;
        }
      }
      return null;
    })
  ).then((result) => result.find((v) => v !== null));

  if (!view) {
    view = await apiClient.post<ZetkinView, Partial<ZetkinView>>(
      `/api/orgs/${orgId}/people/views`,
      {
        title: messages.defaultViewTitles.organizer_action(),
      }
    );
    await apiClient.patch<{ filter_spec: ZetkinSmartSearchFilter[] }>(
      `/api/orgs/${orgId}/people/views/${view.id}/content_query`,
      {
        filter_spec: [callBlockedFilter],
      }
    );
    // Create "First name" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        title: globalMessages.personFields.first_name(),
        type: COLUMN_TYPE.PERSON_FIELD,
      }
    );

    // Create "Last name" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        title: globalMessages.personFields.last_name(),
        type: COLUMN_TYPE.PERSON_FIELD,
      }
    );

    // Create "Organizer action" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          state: 'any',
        },
        title: messages.defaultColumnTitles.organizer_action(),
        type: COLUMN_TYPE.ORGANIZER_ACTION,
      }
    );
  }

  // Redirect to the view
  redirect(`/organize/${view.organization.id}/people/lists/${view.id}`);
}
