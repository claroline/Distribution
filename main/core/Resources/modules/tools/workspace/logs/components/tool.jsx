import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {navigate, matchPath, withRouter} from '#/main/core/router'
import {
    PageActions,
    PageHeader
} from '#/main/core/layout/page'
import {
    RoutedPageContainer,
    RoutedPageContent
} from '#/main/core/layout/router'

// app sections

const Tool = () =>
    <RoutedPageContainer>
      <PageHeader
          title={trans('logs', {}, 'tools')}
      >
      </PageHeader>

        <PageActions> </PageActions>


    </RoutedPageContainer>

export {
  Tool as LogTool
}

/*<RoutedPageContent
 routes={[
 {
 path: '/',
 component: ScheduledTasks,
 exact: true
 }, {
 path: '/users',
 component: ScheduledTask,
 }
 ]}
 />*/