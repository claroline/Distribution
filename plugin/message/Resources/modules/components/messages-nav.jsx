import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'


const MessagesNav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-envelope',
        title: trans('messages_received'),
        path: '/received',
        exact: true
      }, {
        icon: 'fa fa-fw fa-share',
        title: trans('messages_sent'),
        path: '/sent',
        exact: true
      },  {
        icon: 'fa fa-fw fa-trash',
        title: trans('messages_removed'),
        path: '/removed',
        exact: true
      }, {
        icon: 'fa fa-fw fa-plus',
        title: trans('new'),
        path: '/send',
        exact: true
      }
    ]}
  />


export {
  MessagesNav
}
