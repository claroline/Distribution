import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Page} from '#/main/app/page/components/page'

import {actions} from '#/main/core/workspace/analytics/actions'
import {DailyActivity} from '#/main/core/workspace/analytics/components/daily-activity'
import {Resources} from '#/main/core/workspace/analytics/components/resources'

class Tool extends Component {
  constructor(props) {
    super(props)

    if (!this.props.dashboard.loaded) {
      this.props.getDashboard(this.props.workspaceId)
    }
  }

  render() {
    return (
      <Page title={trans('dashboard', {}, 'tools')}>
        {this.props.dashboard.loaded &&
          <DailyActivity activity={this.props.dashboard.data.activity} />
        }

        {this.props.dashboard.loaded &&
          <Resources resourceTypes={this.props.dashboard.data.resourceTypes} />
        }
      </Page>
    )
  }
}

Tool.propTypes = {
  dashboard: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  workspaceId: T.number.isRequired,
  getDashboard: T.func.isRequired
}

const DashboardTool  = connect(
  state => ({
    dashboard: state.dashboard,
    workspaceId: state.workspace.id
  }),
  dispatch => ({
    getDashboard: (workspaceId) => {
      dispatch(actions.getDashboardData('apiv2_workspace_tool_dashboard', {workspaceId}))
    }
  })
)(Tool)

export {
  DashboardTool
}
