import {trans} from '#/main/app/intl/translation'
import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {
  PageContainer,
  PageHeader,
  PageContent
} from '#/main/core/layout/page'


import {constants as listConstants} from '#/main/app/content/list/constants'
import {NotificationCard} from '#/plugin/notification/desktop/tool/components/notification-card'

const List = () =>
  <PageContainer>
    <PageHeader
      title={trans('notifications', {}, 'tools')}
    />
    <PageContent>
      <ListData
        name="notification.notifications"
        fetch={{
          url: ['apiv2_workspace_list_notifications_current'],
          autoload: true
        }}
        display={{
          available: [listConstants.DISPLAY_LIST],
          current: listConstants.DISPLAY_LIST
        }}
        definition={[{
          name: 'text',
          label: trans('text'),
          displayed: true
        }]}
        card={(row) => <NotificationCard {...row}/>}
      />
    </PageContent>
  </PageContainer>

export {
  List
}
