import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {withRouter} from '#/main/app/router'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {selectors as formSelectors} from '#/main/app/content/form/store'
import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {actions as listActions} from '#/main/app/content/list/store'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {Announcement as AnnouncementTypes} from '#/plugin/announcement/resources/announcement/prop-types'
import {actions, selectors} from '#/plugin/announcement/resources/announcement/store'
import {MODAL_ANNOUNCEMENT_SENDING_CONFIRM} from '#/plugin/announcement/resources/announcement/modals'

const AnnounceSendComponent = props =>
  <FormData
    name={selectors.STORE_NAME+'.announcementForm'}
    level={2}
    buttons={true}
    save={{
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-paper-plane-o',
      label: trans('send', {}, 'actions'),
      disabled: 0 === parseInt(get(props.announcement, 'meta.notifyUsers') || 0),
      callback: () => {
        props.send(props.aggregateId, props.announcement)
        props.history.push(props.path)
      }
    }}
    cancel={{
      type: LINK_BUTTON,
      target: props.path,
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'meta.notifyUsers',
            type: 'choice',
            label: trans('announcement_notify_users', {}, 'announcement'),
            options: {
              choices: {
                0: trans('do_not_send', {}, 'announcement'),
                1: trans('send_directly', {}, 'announcement')
              }
            },
            linked: [
              {
                name: 'roles',
                label: trans('roles_to_send_to', {}, 'announcement'),
                type: 'choice',
                displayed: (announcement) => 0 !== parseInt(get(announcement, 'meta.notifyUsers') || 0),
                options: {
                  multiple: true,
                  condensed: true,
                  choices: props.workspaceRoles.reduce((acc, current) => Object.assign(acc, {
                    [current.id]: trans(current.translationKey)
                  }), {})
                }
              }
            ]
          }
        ]
      }
    ]}
  />

AnnounceSendComponent.propTypes = {
  path: T.string.isRequired,
  aggregateId: T.string.isRequired,
  announcement: T.shape(
    AnnouncementTypes.propTypes
  ).isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  send: T.func.isRequired,
  workspaceRoles: T.arrayOf(T.shape({
    id: T.string.isRequired,
    translationKey: T.string.isRequired
  }))
}

AnnounceSendComponent.defaultProps = {
  announcement: AnnouncementTypes.defaultProps
}

const RoutedAnnounceSend = withRouter(AnnounceSendComponent)

const AnnounceSend = connect(
  (state) => ({
    path: resourceSelectors.path(state),
    announcement: formSelectors.data(formSelectors.form(state, selectors.STORE_NAME+'.announcementForm')),
    aggregateId: selectors.aggregateId(state),
    workspaceRoles: selectors.workspaceRoles(state)
  }),
  (dispatch) => ({
    send(aggregateId, announce) {
      dispatch(listActions.addFilter(selectors.STORE_NAME+'.selected.list', 'roles', announce.roles))
      dispatch(
        modalActions.showModal(MODAL_ANNOUNCEMENT_SENDING_CONFIRM, {
          aggregateId: aggregateId,
          announcementId: announce.id,
          handleConfirm: () => {
            dispatch(actions.sendAnnounce(aggregateId, announce))
          }
        })
      )
    }
  })
)(RoutedAnnounceSend)

export {
  AnnounceSend
}
