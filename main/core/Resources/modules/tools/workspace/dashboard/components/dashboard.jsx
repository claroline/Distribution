import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {Row, Col} from 'react-bootstrap'
import {schemeCategory20c} from 'd3-scale'
import {trans} from '#/main/core/translation'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart.jsx'
import {PieChart} from '#/main/core/layout/chart/pie/components/pie-chart.jsx'
import {actions} from '#/main/core/tools/workspace/dashboard/actions'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    if (!props.dashboard.loaded) {
      props.getDashboard(props.workspaceId)
    }
  }

  render() {
    const props = this.props
    let pieValues = []
    if (props.dashboard.data.resourceTypes) {
      pieValues = props.dashboard.data.resourceTypes.map(v => v.yData)
    }
    return(
      <div>
        <div className={'data-card data-card-col'}>
          <div className={'data-card-header'}>
            <div className={'data-card-title text-left'}>
              <i className={'fa fa-area-chart'}/> {trans('last_30_days_activity')}
            </div>
          </div>
          <div className={'data-card-content'}>
            <LineChart
              style={{maxHeight: 250}}
              responsive={true}
              data={props.dashboard.data.activity}
              xAxisLabel={{
                show: true,
                text: trans('date'),
                grid: true
              }}
              yAxisLabel={{
                show: true,
                text: trans('actions'),
                grid: true
              }}
              height={250}
              width={800}
              showArea={true}
              margin={{
                top: 20,
                bottom: 50,
                left: 50,
                right: 20
              }}
            />
          </div>
        </div>
        <Row>
          <Col sm={12} md={6}>
            <div className={'data-card data-card-col'}>
              <div className={'data-card-header'}>
                <div className={'data-card-title text-left'}>
                  <i className={'fa fa-pie-chart'}/> {trans('resources_usage_ratio')}
                </div>
              </div>
              <div className={'data-card-content'}>
                <PieChart
                  data={pieValues}
                  colors={schemeCategory20c}
                  height={500}
                  width={500}
                  margin={{
                    top:50,
                    bottom: 50,
                    left: 50,
                    right: 50
                  }}
                  showValue={true}
                />
              </div>
            </div>
          </Col>
          <Col sm={12} md={6}>

          </Col>
        </Row>
      </div>
    )
  }
}

Dashboard.propTypes = {
  dashboard: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  workspaceId: T.number.isRequired,
  getDashboard: T.func.isRequired
}

const DashboardContainer  = connect(
  state => ({
    dashboard: state.dashboard,
    workspaceId: state.workspaceId
  }),
  disptach => ({
    getDashboard: (workspaceId) => {
      disptach(actions.getDashboardData('apiv2_workspace_tool_dashboard', {workspaceId}))
    }
  })
)(Dashboard)

export {
  DashboardContainer as Dashboard
}