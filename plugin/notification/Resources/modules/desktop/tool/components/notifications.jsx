import {trans} from '#/main/app/intl/translation'
import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {
  PageContainer,
  PageHeader,
  PageContent
} from '#/main/core/layout/page'


import {NotificationCard} from '#/plugin/notification/desktop/tool/components/notification-card'

const Notification = props => <div dangerouslySetInnerHTML={{__html: props.notification.text}}/>

const List = () =>
  <PageContainer>
    <PageHeader
      title={trans('notifications', {}, 'tools')}
    />
    <PageContent>
      <ListData
        name="notifications"
        fetch={{
          url: ['apiv2_workspace_list_notifications_current'],
          autoload: true
        }}
        definition={[{
          name: 'text',
          render: (notification) => <Notification notification={notification}/>,
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
