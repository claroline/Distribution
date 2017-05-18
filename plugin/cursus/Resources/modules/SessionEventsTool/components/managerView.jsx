import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import ReactDOM from 'react-dom'
import {trans, t} from '#/main/core/translation'
import {makeModal} from '#/main/core/layout/modal'
import {selectors} from '../selectors'
import {actions} from '../actions'

const registrationTypes = [
  trans('event_registration_automatic', {}, 'cursus'),
  trans('event_registration_manual', {}, 'cursus'),
  trans('event_registration_public', {}, 'cursus')
]

const EventRow = props =>
  <tr>
    <td>
      <a href={`#${props.event.id}`}>{props.event.name}</a>
    </td>
    <td>{props.event.startDate}</td>
    <td>{props.event.endDate}</td>
    <td className="text-center">
      {Number.isInteger(props.event.maxUsers) ? props.event.maxUsers : '-'}
    </td>
    <td>{registrationTypes[props.event.registrationType]}</td>
    <td>
      <button className="btn btn-default btn-sm margin-right-sm">
        <i className="fa fa-edit"></i>
      </button>
      <button className="btn btn-danger btn-sm" onClick={() => props.deleteSessionEvent(props.event)}>
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
  }).isRequired,
  deleteSessionEvent: T.func.isRequired
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
            <EventRow key={idx} event={event} deleteSessionEvent={props.deleteSessionEvent}/>
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
  })).isRequired,
  deleteSessionEvent: T.func.isRequired
}

class ManagerView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: {}
    }
    this.deleteSessionEvent = this.deleteSessionEvent.bind(this)
  }

  deleteSessionEvent(sessionEvent) {
    this.setState({
      modal: {
        type: 'DELETE_MODAL',
        urlModal: null,
        props: {
          url: null,
          isDangerous: true,
          question: trans('delete_session_event_confirm_message', {}, 'cursus'),
          handleConfirm: () =>  {
            this.setState({modal: {fading: true}})

            this.props.deleteSessionEvent(this.props.workspaceId, sessionEvent.id)
          },
          title: `${trans('delete_session_event', {}, 'cursus')} [${sessionEvent.name}]`
        },
        fading: false
      }
    })
    //console.log(this.props.workspaceId)
    //console.log(sessionEventId)
    //this.props.deleteSessionEvent(this.props.workspaceId, sessionEventId)
  }

  hideModal() {
    this.setState({modal: {fading: true, urlModal: null}})
  }

  render() {
    return (
      <div>
        <Events events={this.props.events} deleteSessionEvent={this.deleteSessionEvent}/>
        {this.state.modal.type &&
          this.props.createModal(
            this.state.modal.type,
            this.state.modal.props,
            this.state.modal.fading,
            this.hideModal.bind(this)
          )
        }
      </div>
    )
  }
}

ManagerView.propTypes = {
  workspaceId: T.number.isRequired,
  events: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string.isRequired,
    registrationType: T.number.isRequired,
    maxUsers: T.number
  })).isRequired,
  deleteSessionEvent: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    workspaceId: state.workspaceId,
    events: selectors.sessionEvents(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteSessionEvent: (workspaceId, sessionEventId) => {
      dispatch(actions.deleteSessionEvent(workspaceId, sessionEventId))
    },
    createModal: (type, props, fading, hideModal) => makeModal(type, props, fading, hideModal, hideModal)
  }
}

const ConnectedManagerView = connect(mapStateToProps, mapDispatchToProps)(ManagerView)

export {ConnectedManagerView as ManagerView}