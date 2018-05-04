import React from 'react'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {constants as listConst} from '#/main/core/data/list/constants'

const Editor = () =>
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
              },
              {
                name: 'display.lastMessages',
                type: 'number',
                label: trans('show_last_messages', {}, 'forum'),
                displayed: forum => forum.display.showOverview
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
              choices: listConst.LIST_DISPLAY_MODES
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
        title: trans('moderation'),
        fields: [
          {
            name: 'moderation.enabled',
            type: 'boolean',
            label: trans('enable_moderation', {}, 'forum')
            // linked: [
            //   // {
            //   //   name: 'enable.superModeration',
            //   //   type: 'boolean',
            //   //   label: trans('super_moderation', {}, 'forum'),
            //   //   displayed: forum => validation
            //   // }
            // ]
          }
        ]
      }
    ]}
  />



export {
  Editor
}
