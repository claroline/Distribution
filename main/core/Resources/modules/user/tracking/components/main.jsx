import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {merge} from 'lodash'

import {CallbackButton} from '#/main/app/buttons/callback/components/button'

import {trans} from '#/main/core/translation'
import {User} from '#/main/core/user/prop-types'
import {ResourceUserEvaluation} from '#/main/core/user/tracking/prop-types'
import {UserPageContainer} from '#/main/core/user/containers/page'
import {UserDetails} from '#/main/core/user/components/details'
import {Timeline} from '#/main/core/user/tracking/components/timeline'
import {DateGroup} from '#/main/core/layout/form/components/group/date-group'

const Search = props =>
  <div className="panel panel-default">
    <div className="panel-body">
      <div className="col-md-6 col-xs-12">
        <DateGroup
            id="tracking-start-date"
            className="form-last"
            calendarIcon="fa fa fa-fw fa-calendar-check-o"
            label={trans('filter_from')}
            value={props.startDate}
            onChange={(date) => props.onChange('startDate', date)}
        />
      </div>
      <div className="col-md-6 col-xs-12">
        <DateGroup
            id="tracking-end-date"
            className="form-last"
            calendarIcon="fa fa fa-fw fa-calendar-check-o"
            label={trans('date_range_end')}
            value={props.endDate}
            minDate={props.startDate}
            onChange={(date) => props.onChange('endDate', date)}
        />
      </div>
      <div className="col-md-6 col-xs-12">
        <CallbackButton
          className="btn btn-primary traking-filter-button"
          callback={() => {
            console.log(props.startDate)
            console.log(props.endDate)
          }}
        >
          {trans('filter')}
        </CallbackButton>
      </div>
    </div>
  </div>

Search.propTypes = {
  startDate: T.string,
  endDate: T.string,
  onChange: T.func.isRequired
}

const Summary = props =>
  <div className="panel panel-default">
    <div className="panel-body">
      Coucou
    </div>
  </div>

class TrackingComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filters: {
        startDate: null,
        endDate: null,
      }
    }
    this.updateProp = this.updateProp.bind(this)
  }

  updateProp(propName, propValue) {
    const filters = merge({}, this.state.filters, {[propName]: propValue.replace(/T.*$/i, '')})
    this.setState(() => ({filters: filters}))
  }

  render() {
    return(
      <UserPageContainer
        customActions={[
          {
            type: 'url',
            icon: 'fa fa-fw fa-id-card-o',
            label: trans('show_profile', {}, 'platform'),
            target: ['claro_user_profile', {publicUrl: this.props.user.meta.publicUrl}]
          }, {
            type: 'callback',
            icon: 'fa fa-fw fa-file-pdf-o',
            label: trans('export_tracking_pdf', {}, 'platform'),
            callback: () => true
          }
        ]}
      >
        <div className="row">
          <div className="col-md-3">
            <UserDetails
              user={this.props.user}
            />
          </div>

          <div className="col-md-9">
            <h2>{trans('activities_tracking')}</h2>

            <Search
              startDate={this.state.filters.startDate}
              endDate={this.state.filters.endDate}
              onChange={this.updateProp}
            />

            <Summary />

            <Timeline
              events={this.props.evaluations.map(e => {return {
                date: e.date,
                type: 'evaluation',
                status: e.status,
                progression: e.score !== null && e.scoreMax !== null ? [e.score, e.scoreMax] : null,
                data: {
                  resourceNode: e.resourceNode,
                  nbAttempts: e.nbAttempts,
                  nbOpenings: e.nbOpenings,
                  duration: e.duration
                }
              }})}
            />
          </div>
        </div>
      </UserPageContainer>
    )
  }
}

TrackingComponent.propTypes = {
  user: T.shape(User.propTypes).isRequired,
  evaluations: T.arrayOf(T.shape(ResourceUserEvaluation.propTypes))
}

const Tracking = connect(
  state => ({
    user: state.user,
    evaluations: state.evaluations
  }),
  null
)(TrackingComponent)

export {
  Tracking
}
