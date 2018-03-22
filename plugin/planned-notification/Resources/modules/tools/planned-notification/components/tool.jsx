import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {RoutedPage, RoutedPageContent} from '#/main/core/layout/router'
import {
  PageContainer,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {select} from '#/plugin/planned-notification/tools/planned-notification/selectors'
import {Notifications} from '#/plugin/planned-notification/tools/planned-notification/components/notifications.jsx'

const Tool = props => {
  const routes = [
    {
      path: '/notifications',
      component: Notifications
    }
  ]
  const redirect = [{
    from: '/',
    to: '/notifications',
    exact: true
  }]
  const customActions = [
    {
      icon: 'fa fa-fw fa-bell',
      label: trans('notifications'),
      displayed: props.canEdit,
      action: '#/notifications'
    }
  ]

  return (
    <PageContainer id="ws-planned-notification-tool-container">
      <PageHeader
        title={trans('claroline_planned_notification_tool', {}, 'tools')}
        key="tool-container-header"
      >
        <PageActions>
          <PageAction
            id="notification-add"
            title={trans('add_planned_notification', {}, 'planned_notification')}
            icon="fa fa-plus"
            primary={true}
            action={() => console.log('go go go')}
          />
        </PageActions>
      </PageHeader>
      <PageContent key="tool-container-content">
        <RoutedPage>
          <RoutedPageContent
            headerSpacer={false}
            redirect={redirect}
            routes={routes}
          />
        </RoutedPage>
      </PageContent>
    </PageContainer>
  )
}

Tool.propTypes = {
  canEdit: T.bool.isRequired
}

const PlannedNotificationTool = connect(
  state => ({
    canEdit: select.canEdit(state)
  })
)(Tool)

export {
  PlannedNotificationTool
}