import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/page/containers/tabbed-page.jsx'

// app sections
import {OverviewTab, OverviewTabActions} from '#/main/core/tools/workspace/logs/overview/components/overview-tab.jsx'
import {UserTab, UserTabActions} from '#/main/core/tools/workspace/logs/user/components/user-tab.jsx'

const Tool = () =>
  <TabbedPageContainer
    redirect={[
      {from: '/', exact: true, to: '/overview'}
    ]}

    tabs={[
      {
        icon: 'fa fa-list',
        title: trans('users'),
        path: '/overview',
        actions: OverviewTabActions,
        content: OverviewTab
      }, {
        icon: 'fa fa-user',
        title: trans('groups'),
        path: '/users',
        actions: UserTabActions,
        content: UserTab
      }
    ]}
  />

export {
  Tool as LogTool
}
