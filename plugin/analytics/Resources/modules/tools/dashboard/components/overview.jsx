import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {selectors as toolSelectors} from  '#/main/core/tool/store'
import {actions, selectors} from '#/plugin/analytics/tools/dashboard/store'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {WorkspaceMetrics} from '#/main/core/workspace/components/metrics'

import {ActivityChart} from '#/plugin/analytics/charts/activity/components/chart'
import {ResourcesChart} from '#/plugin/analytics/charts/resources/containers/chart'

class OverviewComponent extends Component {
  constructor(props) {
    super(props)

    if (!this.props.analytics.loaded) {
      this.props.getAnalytics(this.props.workspace.id)
    }
  }

  render() {
    return (
      <Fragment>
        <WorkspaceMetrics
          style={{
            marginTop: 20 // FIXME
          }}
          workspace={this.props.workspace}
          nbConnections={this.props.nbConnections}
        />

        {this.props.analytics.loaded &&
          <ActivityChart activity={this.props.analytics.data.activity} />
        }

        <ResourcesChart />

      </Fragment>
    )
  }
}

OverviewComponent.propTypes = {
  analytics: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  nbConnections: T.number.isRequired,
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  getAnalytics: T.func.isRequired
}

const Overview = connect(
  state => ({
    analytics: selectors.analytics(state),
    nbConnections: selectors.nbConnections(state),
    workspace: toolSelectors.contextData(state)
  }),
  dispatch => ({
    getAnalytics: (workspaceId) => {
      dispatch(actions.getAnalyticsData('apiv2_workspace_tool_dashboard', {workspaceId}))
    }
  })
)(OverviewComponent)

export {
  Overview
}
