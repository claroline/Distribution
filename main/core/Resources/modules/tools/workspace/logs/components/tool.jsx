import React from 'react'
import {trans} from '#/main/core/translation'
import {
    PageActions,
    MoreAction,
    PageHeader
} from '#/main/core/layout/page'
import {
    RoutedPageContainer,
    RoutedPageContent
} from '#/main/core/layout/router'

// app pages
import {Logs} from '#/main/core/tools/workspace/logs/components/overview/list.jsx'
import {UserLogs} from '#/main/core/tools/workspace/logs/components/users/list.jsx'
import {LogDetails} from '#/main/core/tools/workspace/logs/components/overview/detail.jsx'

const Tool = () =>
  <RoutedPageContainer>
    <PageHeader title={trans('logs', {}, 'tools')}>
      <PageActions>
        <MoreAction
          actions = {[
            {
              action: '#/users',
              label: trans('user_tracking', {}, 'log'),
              icon: 'fa fa-users'
            }
          ]}
        />
      </PageActions>
    </PageHeader>
    <RoutedPageContent
      routes={[
        {
          path: '/',
          component: Logs,
          exact: true
        }, {
          path: '/log/:id',
          component: LogDetails,
          exact: true
        }, {
          path: '/users',
          component: UserLogs,
          exact: true
        }
      ]}
    />
  </RoutedPageContainer>

export {
  Tool as LogTool
}
