import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

import {WorkspaceTab, WorkspaceTabActions} from '#/main/core/administration/workspace/workspace/components/workspace-tab'
import {ParametersTab} from '#/main/core/administration/workspace/parameters/components/parameters-tab'

const Messaging = () =>
  <TabbedPageContainer
    title={trans('messaging', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/sent'}
    ]}

    tabs={[
      {
        icon: 'fa fa-book',
        title: trans('sent'),
        path: '/sent'
      }, {
        icon: 'fa fa-cog',
        title: trans('received'),
        path: '/received'
      }, {
        icon: 'fa fa-cog',
        title: trans('removed'),
        path: '/removed'
      }, {
        icon: 'fa fa-cog',
        title: trans('send'),
        path: '/send'
      }
    ]}
  />

export {
  Messaging
}
