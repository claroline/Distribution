import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'
import {
  navigate,
  matchPath,
  withRouter
} from '#/main/core/router'
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
import {actions as logActions} from  '#/main/core/tools/workspace/logs/actions'

const Actions = (props) => {
  let moreActions = []
  if (matchPath(props.location.pathname, {path: '/', exact: true})) {
    moreActions = moreActions.concat([
      {
        action: '#/users',
        label: trans('user_tracking', {}, 'log'),
        icon: 'fa fa-users'
      },
      {
        action: generateUrl('apiv2_workspace_tool_logs_list_csv', {'workspaceId': props.workspaceId}),
        label: trans('download_csv_list', {}, 'log'),
        icon: 'fa fa-download'
      }
    ])
  }
  
  if (matchPath(props.location.pathname, {path: '/users', exact: true})) {
    moreActions = moreActions.concat([
      {
        action: '#/',
        label: trans('list', {}, 'platform'),
        icon: 'fa fa-list'
      },
      {
        action: generateUrl('apiv2_workspace_tool_logs_list_csv', {'workspaceId': props.workspaceId}),
        label: trans('download_csv_list', {}, 'log'),
        icon: 'fa fa-download'
      }
    ])
  }
  return (
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
      {moreActions.length > 0 && <MoreAction actions = {moreActions}/>}
    </PageActions>
  )
}
Actions.propTypes = {
  workspaceId: T.number.isRequired,
  location: T.object.isRequired
}

const ToolActions = withRouter(Actions)

const Tool = (props) =>
  <RoutedPageContainer>
    <PageHeader title={trans('logs', {}, 'tools')}>
      <ToolActions workspaceId={props.workspaceId}/>
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
