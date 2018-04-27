import React from 'react'
// import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'


const Editor = props =>
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
                displayed: forum => forum.display.showOverview
              }
            ]
          },
          {
            name: 'display.lastMessages',
            type: 'number',
            label: trans('show_last_messages', {}, 'forum')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-comments',
        title: trans('posts', {}, 'forum'),
        fields: [
          {
            name: 'max.subjects',
            type: 'number',
            label: trans('max_subjects', {}, 'forum')
          },
          {
            name: 'max.message.subjects',
            type: 'number',
            label: trans('max_message_by_subject', {}, 'forum')
          },
          {
            name: 'closing.date.forum.',
            type: 'date',
            label: trans('closing_date', {}, 'forum')
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
        title: trans('moderation'),
        fields: [
          {
            name: 'moderation.enabled',
            type: 'boolean',
            label: trans('enable_moderation', {}, 'forum'),
            linked: [
              {
                name: 'enable.superModeration',
                type: 'boolean',
                label: trans('super_moderation', {}, 'forum'),
                displayed: forum => forum.moderation.enabled
              }
            ]
          }
        ]
      }
    ]}
  />



export {
  Editor
}
