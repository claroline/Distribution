import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {navigate, matchPath, withRouter} from '#/main/core/router'
import {
    PageActions,
    MoreAction,
    PageAction,
    PageHeader
} from '#/main/core/layout/page'
import {
    RoutedPageContainer,
    RoutedPageContent
} from '#/main/core/layout/router'


// app pages
import {Logs} from '#/main/core/tools/workspace/logs/components/overview/list.jsx'
import {UserLogs} from '#/main/core/tools/workspace/logs/components/users/list.jsx'
import {LogDetails} from '#/main/core/tools/workspace/logs/components/overview/details.jsx'
import {actions as logActions} from  '#/main/core/tools/workspace/logs/actions.js'

const Actions = (props) =>
  <PageActions>
    {
      matchPath(props.location.pathname, {path: '/log/:id'}) &&
        <PageAction
          id={'back-to-list'}
          title={trans('back', {}, 'platform')}
          icon={'fa fa-share fa-flip-horizontal'}
          action={() => navigate('/')}
        />
    }
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

const ToolActions = withRouter(Actions)

const Tool = (props) =>
  <RoutedPageContainer>
    <PageHeader title={trans('logs', {}, 'tools')}>
      <ToolActions />
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
          exact: true,
          onEnter: (params) => props.openLog(params.id, props.workspaceId)
        }, {
          path: '/users',
          component: UserLogs,
          exact: true
        }
      ]}
    />
  </RoutedPageContainer>

Tool.propTypes = {
  workspaceId: T.number.isRequired,
  openLog: T.func.isRequired
}

const ToolContainer = connect(
  state => ({
    workspaceId: state.workspaceId
  }),
  dispatch => ({
    openLog(id, workspaceId) {
      dispatch(logActions.openLog(id, workspaceId))
    }
  })
)(Tool)

export {
  ToolContainer as LogTool
}
