import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {selectors as formSelectors} from '#/main/app/content/form/store'
import {FormData} from '#/main/app/content/form/containers/data'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {
  TRIGGERING_ACTIONS,
  WORKSPACE_REGISTRATION_USER,
  WORKSPACE_REGISTRATION_GROUP
} from '#/plugin/planned-notification/tools/planned-notification/constants'
import {selectors} from '#/plugin/planned-notification/tools/planned-notification/store'
import {Notification as NotificationType} from '#/plugin/planned-notification/tools/planned-notification/prop-types'

const NotificationForm = props =>
  <FormData
    level={3}
    name={selectors.STORE_NAME+'.notifications.current'}
    disabled={!props.canEdit}
    buttons={true}
    target={(notification, isNew) => isNew ?
      ['apiv2_plannednotification_create'] :
      ['apiv2_plannednotification_update', {id: notification.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: props.path+'/notifications',
      exact: true
    }}
    sections={[
      {
        id: 'general',
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.action',
            type: 'choice',
            label: trans('action'),
            required: true,
            options: {
              noEmpty: true,
              condensed: true,
              choices: TRIGGERING_ACTIONS
            },
            linked: [
              {
                name: 'roles',
                label: trans('roles'),
                type: 'workspace_roles',
                required: false,
                displayed: props.notification.parameters &&
                  props.notification.parameters.action &&
                  -1 < [WORKSPACE_REGISTRATION_USER, WORKSPACE_REGISTRATION_GROUP].indexOf(props.notification.parameters.action)
              }
            ]
          }, {
            name: 'message',
            type: 'message',
            label: trans('message'),
            required: true
          }, {
            name: 'parameters.interval',
            type: 'number',
            label: trans('planned_interval', {}, 'planned_notification'),
            help: trans('planned_interval_infos', {}, 'planned_notification'),
            options: {
              min: 0,
              unit: trans('days')
            },
            required: true
          }, {
            name: 'parameters.byMail',
            type: 'boolean',
            label: trans('send_a_mail', {}, 'planned_notification'),
            required: true
          }, {
            name: 'parameters.byMessage',
            type: 'boolean',
            label: trans('send_a_message', {}, 'planned_notification'),
            required: true
          }
        ]
      }
    ]}
  />

NotificationForm.propTypes = {
  path: T.string.isRequired,
  canEdit: T.bool.isRequired,
  new: T.bool.isRequired,
  notification: T.shape(NotificationType.propTypes).isRequired
}

const Notification = connect(
  state => ({
    path: toolSelectors.path(state),
    canEdit: selectors.canEdit(state),
    roles: selectors.workspaceRolesChoices(state),
    new: formSelectors.isNew(formSelectors.form(state, selectors.STORE_NAME+'.notifications.current')),
    notification: formSelectors.data(formSelectors.form(state, selectors.STORE_NAME+'.notifications.current'))
  })
)(NotificationForm)

export {
  Notification
}