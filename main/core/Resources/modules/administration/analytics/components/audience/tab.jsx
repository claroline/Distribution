import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'

import {trans} from '#/main/core/translation'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart.jsx'
import {actions} from '#/main/core/administration/analytics/actions'
import {DashboardCard} from '#/main/core/layout/dashboard/index'

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.audience.loaded) {
      props.getAudienceData()
    }
  }
  
  render() {
    return(
      <Grid className="analytics-resources-container">
        {this.props.audience.data.users &&
        <Row>
          <Col xs={12}>
            <div className={'dashboard-standout'}>
              <span className={'dashboard-standout-text-lg'}>
                {this.props.audience.data.users.all}
              </span>
              <span className={'dashboard-standout-text-sm'}>
                <span>{trans('users_connected_once')}</span>
              </span>
            </div>
          </Col>
        </Row>
        }
        {this.props.audience.data.activity &&
        <Row>
          <Col xs={12}>
            <DashboardCard title={trans('users_visits')} icon={'fa-area-chart'}>
              <div className={'dashboard-standout text-center'}>
                <span className={'dashboard-standout-text-lg'}>
                  <span
                    dangerouslySetInnerHTML={{__html: trans(
                      'count_connections_and_users_by_date_range',
                      {
                        'countConnections': this.props.audience.data.activity.total,
                        'countUsers': this.props.audience.data.users.period
                      })
                    }}
                  />
                </span>
              </div>
              <LineChart
                style={{maxHeight: 250}}
                responsive={true}
                data={this.props.audience.data.activity.daily}
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
        }
      </Grid>
    )
  }
}

Tab.propTypes = {
  audience: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getAudienceData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    audience: state.audience
  }),
  dispatch => ({
    getAudienceData() {
      dispatch(actions.getAudienceData())
    }
  })
)(Tab)

export {
  TabContainer as AudienceTab
}