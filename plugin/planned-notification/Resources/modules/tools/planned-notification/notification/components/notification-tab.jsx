import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {makeId} from '#/main/core/scaffolding/id'
import {trans} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {PageAction} from '#/main/core/layout/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {select} from '#/plugin/planned-notification/tools/planned-notification/selectors'
import {constants} from '#/plugin/planned-notification/tools/planned-notification/constants'
import {actions} from '#/plugin/planned-notification/tools/planned-notification/notification/actions'
import {Notifications} from '#/plugin/planned-notification/tools/planned-notification/notification/components/notifications.jsx'
import {Notification} from '#/plugin/planned-notification/tools/planned-notification/notification/components/notification.jsx'

const NotificationTabEditActionsComponent = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="notifications.current"
      target={(notification, isNew) => isNew ?
        ['apiv2_plannednotification_create'] :
        ['apiv2_plannednotification_update', {id: notification.id}]
      }
      opened={!!matchPath(props.location.pathname, {path: '/notifications/form'})}
      open={{
        icon: 'fa fa-plus',
        label: trans('create_planned_notification', {}, 'planned_notification'),
        action: '#/notifications/form'
      }}
      cancel={{
        action: () => navigate('/notifications')
      }}
    />
  </PageActions>

NotificationTabEditActionsComponent.propTypes = {
  location: T.object
}

const NotificationTabEditActions = withRouter(NotificationTabEditActionsComponent)

const NotificationTabActionsComponent = props =>
  <PageActions>
    {!!matchPath(props.location.pathname, {path: '/notifications/form'}) &&
      <PageAction
        id="notification-form-save"
        title={trans('cancel')}
        icon="fa fa-times"
        primary={false}
        action="#/notifications"
      />
    }
  </PageActions>

NotificationTabActionsComponent.propTypes = {
  location: T.object
}

const NotificationTabActions = withRouter(NotificationTabActionsComponent)

const NotificationTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/notifications',
        exact: true,
        component: Notifications
      }, {
        path: '/notifications/form/:id?',
        component: Notification,
        onEnter: (params) => props.openForm(params.id, props.workspace)
      }
    ]}
  />

NotificationTabComponent.propTypes = {
  canEdit: T.bool.isRequired,
  workspace: T.object.isRequired
}

const NotificationTab = connect(
  state => ({
    canEdit: select.canEdit(state),
    workspace: select.workspace(state)
  }),
  dispatch => ({
    openForm(id, workspace) {
      const defaultValue = {
        id: makeId(),
        workspace: workspace,
        parameters: {
          action: constants.WORKSPACE_REGISTRATION,
          interval: 1,
          byMail: true,
          byMessage: false
        }
      }

      dispatch(actions.open('notifications.current', id, defaultValue))
    }
  })
)(NotificationTabComponent)

export {
  NotificationTabEditActions,
  NotificationTabActions,
  NotificationTab
}