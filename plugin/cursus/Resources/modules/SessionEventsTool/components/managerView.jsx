import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {trans, t} from '#/main/core/translation'
import {selectors} from '../selectors'

const registrationTypes = [
  trans('event_registration_automatic', {}, 'cursus'),
  trans('event_registration_manual', {}, 'cursus'),
  trans('event_registration_public', {}, 'cursus')
]

const EventRow = props =>
  <tr>
    <td>{props.event.name}</td>
    <td>{props.event.startDate}</td>
    <td>{props.event.endDate}</td>
    <td className="text-center">
      {Number.isInteger(props.event.maxUsers) ? props.event.maxUsers : '-'}
    </td>
    <td>{registrationTypes[props.event.registrationType]}</td>
    <td>
      <button className="btn btn-danger btn-sm">
        <i className="fa fa-trash"></i>
      </button>
    </td>
  </tr>

EventRow.propTypes = {
  event: T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string.isRequired,
    registrationType: T.number.isRequired,
    maxUsers: T.number
  }).isRequired
}

const Events = props =>
  <div>
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{trans('session_event', {}, 'cursus')}</th>
            <th>{t('start_date')}</th>
            <th>{t('end_date')}</th>
            <th>{trans('max_users', {}, 'cursus')}</th>
            <th>{t('registration')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {props.events.map((event, idx) =>
            <EventRow key={idx} event={event}/>
          )}
        </tbody>
      </table>
    </div>
    <br/>
    <button className="btn btn-primary">
      {trans('create_session_event', {}, 'cursus')}
    </button>
  </div>

Events.propTypes = {
  events: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string.isRequired,
    registrationType: T.number.isRequired,
    maxUsers: T.number
  })).isRequired
}

class ManagerView extends Component {
  render() {
    return (
      <Events events={this.props.events}/>
    )
  }
}

ManagerView.propTypes = {
  events: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string.isRequired,
    registrationType: T.number.isRequired,
    maxUsers: T.number
  })).isRequired
}

function mapStateToProps(state) {
  return {
    events: selectors.sessionEvents(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedManagerView = connect(mapStateToProps, mapDispatchToProps)(ManagerView)

export {ConnectedManagerView as ManagerView}