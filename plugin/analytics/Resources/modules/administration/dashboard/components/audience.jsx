import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {merge} from 'lodash'
import {schemeCategory20c} from 'd3-scale'

// todo : remove me
import {Grid, Row, Col} from 'react-bootstrap'

import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/components/data'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'

import {actions, selectors} from '#/plugin/analytics/administration/dashboard/store'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart'
import {DashboardCard} from '#/main/core/layout/dashboard'

const FilterForm = (props) =>
  <FormData
    level={3}
    data={props.data}
    title={trans('show')}
    pendingChanges={false}
    validating={false}
    setErrors={() => {}}
    className={'dashboard-filter-form'}
    updateProp={props.updateProp}
    sections={[
      {
        id: 'general',
        title: '',
        primary: true,
        fields: [
          {
            name: 'unique',
            type: 'boolean',
            label: trans('unique_connections')
          }, {
            name: 'dateLog',
            type: 'date',
            label: trans('activity_rule_form_activeFrom'),
            required: true
          }, {
            name: 'dateTo',
            type: 'date',
            label: trans('activity_rule_form_activeUntil'),
            required: true
          }
        ]
      }
    ]}
  >
    <CallbackButton
      className={'btn btn-primary'}
      callback={props.submitForm}
    >
      {trans('show_actions')}
    </CallbackButton>
  </FormData>

FilterForm.propTypes = {
  'updateProp': T.func.isRequired,
  'submitForm': T.func.isRequired,
  'data': T.object.isRequired
}

class AudienceComponent extends Component {
  constructor(props) {
    super(props)
    
    if (!props.audience.loaded) {
      props.getAudienceData()
    }
    this.state = {
      filters: {}
    }
    this.updateProp = this.updateProp.bind(this)
    this.filterAudienceData = this.filterAudienceData.bind(this)
  }
  
  updateProp(propName, propValue) {
    const filters = merge({}, this.state.filters, {[propName]: propValue})
    this.setState(() => ({filters: filters}))
  }
  
  filterAudienceData() {
    this.props.getAudienceData(this.state.filters)
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.audience.loaded) {
      this.setState({filters: nextProps.audience.data.filters})
    }
    
    this.setState(nextProps)
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
        {this.props.audience.data.filters &&
        <Row>
          <Col xs={12} md={4}>
            <FilterForm
              updateProp={this.updateProp}
              submitForm={this.filterAudienceData}
              data={this.state.filters}
            />
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
                data={[this.props.audience.data.activity.daily]}
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
                colors={schemeCategory20c}
              />
            </DashboardCard>
          </Col>
        </Row>
        }
      </Grid>
    )
  }
}

AudienceComponent.propTypes = {
  audience: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getAudienceData: T.func.isRequired
}

const Audience = connect(
  state => ({
    audience: selectors.audience(state)
  }),
  dispatch => ({
    getAudienceData(filters = {}) {
      dispatch(actions.getAudienceData(filters))
    }
  })
)(AudienceComponent)

export {
  Audience
}