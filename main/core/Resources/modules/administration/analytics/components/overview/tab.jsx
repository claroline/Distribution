import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {trans} from '#/main/core/translation'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart.jsx'
import {actions} from '#/main/core/administration/analytics/actions'
import {AnalyticsCard} from '#/main/core/administration/analytics/components/analytics-card'
import {
  Table,
  TableHeaderCell,
  TableRow,
  TableCell
} from '#/main/core/layout/table/components/table.jsx'

const AnalyticsTable = (props) =>
  <Table className="data-table" condensed={true}>
    <thead>
      <TableRow>
        {props.definition.map((val, index) =>
          <TableHeaderCell key={index} align={'left'}>
            {val.label}
          </TableHeaderCell>
        )}
      </TableRow>
    </thead>
    <tbody>
      {props.data.map((data,index) =>
        <TableRow key={index}>
          {props.definition.map((val, index) =>
            <TableCell key={index} align={'left'}>
              {data[val.name]}
            </TableCell>
          )}
        </TableRow>
      )}
    </tbody>
  </Table>

AnalyticsTable.propTypes = {
  definition: T.arrayOf(T.shape({
    name: T.string.isRequired,
    label: T.string.isRequired
  })).isRequired,
  data: T.array.isRequired
}

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.overview.loaded) {
      props.getOverviewData()
    }
  }
  
  render() {
    return(
      <Grid className="analytics-overview-container">
        <Row>
          <Col xs={12}>
            <AnalyticsCard title={trans('last_30_days_activity')} icon={'fa-area-chart'}>
              <LineChart
                style={{maxHeight: 250}}
                responsive={true}
                data={this.props.overview.data.activity}
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
            </AnalyticsCard>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <AnalyticsCard title={trans('account_general_statistics')} icon={'fa-user'}>
            asdfa
            </AnalyticsCard>
          </Col>
        </Row>
        {
          this.props.overview.data.top &&
          this.props.overview.data.top.workspace &&
          this.props.overview.data.top.workspace.length > 0 &&
          <Row>
            <Col xs={12}>
              <AnalyticsCard title={trans('ws_most_viewed')} icon={'fa-book'}>
                <AnalyticsTable
                  definition={[
                    {
                      name: 'name',
                      label: trans('name')
                    }, {
                      name: 'actions',
                      label: trans('connections')
                    }
                  ]}
                  data={this.props.overview.data.top.workspace}
                />
              </AnalyticsCard>
            </Col>
          </Row>
        }
        {
          this.props.overview.data.top &&
          this.props.overview.data.top.media &&
          this.props.overview.data.top.media.length > 0 &&
          <Row>
            <Col xs={12}>
              <AnalyticsCard title={trans('media_most_viewed')} icon={'fa-file'}>
                <AnalyticsTable
                  definition={[
                    {
                      name: 'name',
                      label: trans('name')
                    }, {
                      name: 'actions',
                      label: trans('views')
                    }
                  ]}
                  data={this.props.overview.data.top.media}
                />
              </AnalyticsCard>
            </Col>
          </Row>
        }
        {
          this.props.overview.data.top &&
          this.props.overview.data.top.download &&
          this.props.overview.data.top.download.length > 0 &&
          <Row>
            <Col xs={12}>
              <AnalyticsCard title={trans('resources_most_downloaded')} icon={'fa-download'}>
                <AnalyticsTable
                  definition={[
                    {
                      name: 'name',
                      label: trans('name')
                    }, {
                      name: 'actions',
                      label: trans('downloads')
                    }
                  ]}
                  data={this.props.overview.data.top.download}
                />
              </AnalyticsCard>
            </Col>
          </Row>
        }
      </Grid>
    )
  }
}

Tab.propTypes = {
  overview: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getOverviewData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    overview: state.overview
  }),
  dispatch => ({
    getOverviewData() {
      dispatch(actions.getOverviewData())
    }
  })
)(Tab)

export {
  TabContainer as OverviewTab
}
