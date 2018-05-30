import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form'

import {select} from '#/plugin/forum/resources/forum/selectors'
import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {constants} from '#/plugin/forum/resources/forum/constants'

const EditorComponent = (props) =>
  <FormContainer
    level={3}
    displayLevel={2}
    name="forumForm"
    title={trans('parameters')}
    className="content-container"
    sections={[
      {
        icon: 'fa fa-fw fa-home',
        title: trans('overview'),
        fields: [
          {
            name: 'display.showOverview',
            type: 'boolean',
            label: trans('show_overview', {}, 'forum'),
            linked: [
              {
                name: 'display.description',
                type: 'html',
                label: trans('overview_message', {}, 'forum'),
                displayed: props.forum.display.showOverview
              },
              {
                name: 'display.lastMessages',
                type: 'number',
                label: trans('show_last_messages', {}, 'forum'),
                displayed: props.forum.display.showOverview
              }
            ]
          }
        ]
      }, {
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        fields: [
          {
            name: 'display.subjectList',
            type: 'enum',
            label: trans('subjects_list_display', {}, 'forum'),
            options: {
              noEmpty: true,
              choices: constants.LIST_DISPLAY_MODES
            }
          }
        ]
      }, {
        icon: 'fa fa-fw fa-comments',
        title: trans('forum_settings', {}, 'forum'),
        fields: [
          {
            name: 'forum.lock',
            type: 'date',
            label: trans('locking_date', {}, 'forum'),
            help: trans('locking_date_explenation', {}, 'forum')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-bell-o',
        title: trans('notifications', {}, 'forum'),
        fields: [
          {
            name: 'notifications.enabled',
            type: 'boolean',
            label: trans('activate_global_notifications', {}, 'forum'),
            help: trans('notifications_explanation', {}, 'forum')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-gavel',
        title: trans('moderation', {}, 'forum'),
        fields: [
          {
            name: 'flag.enabled',
            type: 'boolean',
            label: trans('enable_flag', {}, 'forum'),
            value: true
          },
          {
            name: 'moderation.enabled',
            type: 'boolean',
            label: trans('enable_moderation', {}, 'forum'),
            linked: [
              {
                name: 'firstMessageModerated',
                type: 'boolean',
                label: trans('first_message_moderated', {}, 'forum'),
                help: trans('first_message_moderated_explenation', {}, 'forum'),
                displayed: props.forum.moderation.enabled
              },
              {
                name: 'AllMessagesModerated',
                type: 'boolean',
                label: trans('all_message_moderated', {}, 'forum'),
                help: trans('all_message_moderated_explenation', {}, 'forum'),
                displayed: props.forum.moderation.enabled
              }
            ]
          }
        ]
      }
    ]}
  />

EditorComponent.propTypes = {
  forum: T.shape(ForumType.propTypes).isRequired
}

const Editor = connect(
  (state) => ({
    forum: select.forum(state)
  })
)(EditorComponent)

export {
  Editor
}
