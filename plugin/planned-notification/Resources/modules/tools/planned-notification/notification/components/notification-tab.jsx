import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {PageAction} from '#/main/core/layout/page'

import {select} from '#/plugin/planned-notification/tools/planned-notification/selectors'
import {Notifications} from '#/plugin/planned-notification/tools/planned-notification/notification/components/notifications.jsx'

const NotificationTabActionsComponent = props => {
  return(
    <PageActions>
      <PageAction
        id='add-notification'
        title={trans('create_planned_notification', {}, 'planned_notification')}
        icon={'fa fa-plus'}
        disabled={false}
        action={() => console.log('create planned notificaiton')}
        primary={true}
      />
    </PageActions>
  )
}

NotificationTabActionsComponent.propTypes = {
}

const ConnectedActions = connect(
  state => ({
  }),
  dispatch => ({
  })
)(NotificationTabActionsComponent)

const NotificationTabActions = withRouter(ConnectedActions)

const NotificationTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/notifications',
        exact: true,
        component: Notifications
      }, {
        path: '/notifications/form/:id?',
        component: Notifications,
        // onEnter: (params) => props.openForm(
        //   params.id || null,
        //   props.workspace,
        //   props.restrictions,
        //   props.collaboratorRole
        // ),
        onEnter: (params) => console.log('notifications form')
      }
    ]}
  />

NotificationTabComponent.propTypes = {
  canEdit: T.bool.isRequired
}

const NotificationTab = connect(
  state => ({
    canEdit: select.canEdit(state)
  }),
  dispatch => ({
  })
)(NotificationTabComponent)

export {
  NotificationTabActions,
  NotificationTab
}