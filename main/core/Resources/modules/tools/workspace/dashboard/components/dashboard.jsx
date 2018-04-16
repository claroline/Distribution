import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {schemeCategory20c} from 'd3-scale'
import {trans} from '#/main/core/translation'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart.jsx'
import {PieChart} from '#/main/core/layout/chart/pie/components/pie-chart.jsx'
import {actions} from '#/main/core/tools/workspace/dashboard/actions'
import {
  Table,
  TableHeaderCell,
  TableRow,
  TableCell
} from '#/main/core/layout/table/components/table.jsx'

const ResourceTypesTable = (props) =>
  <Table className="data-table" condensed={true}>
    <thead>
      <TableRow>
        <TableHeaderCell align={'left'}>
          {trans('resources')}
        </TableHeaderCell>
        <TableHeaderCell align={'left'}>
          #
        </TableHeaderCell>
      </TableRow>
    </thead>
    <tbody>
      {Object.keys(props.data).map((key, index) =>
        <TableRow key={key}>
          <TableCell align={'left'}>
            <span className="dashboard-color-legend" style={{backgroundColor: schemeCategory20c[index]}}/>
            {trans(props.data[key].xData, {}, 'resource')}
          </TableCell>
          <TableCell align={'left'}>
            {props.data[key].yData}
          </TableCell>
        </TableRow>
      )}
    </tbody>
  </Table>

ResourceTypesTable.propTypes = {
  data: T.object.isRequired
}

const DashboardCard = (props) =>
  <div className={'dashboard-card data-card data-card-col'}>
    <div className={'data-card-header'}>
      <div className={'data-card-title text-left'}>
        {props.icon && <i className={`fa ${props.icon}`}/>}
        <span>{props.title}</span>
      </div>
    </div>
    <div className={'data-card-content'}>
      {props.children}
    </div>
  </div>

DashboardCard.propTypes = {
  title: T.string.isRequired,
  icon: T.string,
  children: T.element.isRequired
}

class Dashboard extends Component {
  constructor(props) {
    super(props)

    if (!props.dashboard.loaded) {
      props.getDashboard(props.workspaceId)
    }
  }

  render() {
    const props = this.props
    return(
      <Grid className={'dashboard-container'}>
        <Row className={'dashboard-row'}>
          <Col xs={12}>
            <DashboardCard title={trans('last_30_days_activity')} icon={'fa-area-chart'}>
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
            </DashboardCard>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <DashboardCard title={trans('resources_usage_ratio')} icon={'fa-pie-chart'}>
              <PieChart
                style={{
                  margin: 'auto'
                }}
                data={props.dashboard.data.resourceTypes || {}}
                width={400}
                margin={{
                  top:25
                }}
                colors={schemeCategory20c}
                showPercentage={true}
              />
            </DashboardCard>
          </Col>
          <Col sm={12} md={6}>
            <DashboardCard title={trans('resources_usage_list')} icon={'fa-list'}>
              <ResourceTypesTable data={props.dashboard.data.resourceTypes || {}}/>
            </DashboardCard>
          </Col>
        </Row>
      </Grid>
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