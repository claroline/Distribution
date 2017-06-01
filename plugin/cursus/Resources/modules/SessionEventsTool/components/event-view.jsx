import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {trans, t} from '#/main/core/translation'
import {makeModal} from '#/main/core/layout/modal'
import {actions} from '../actions'
import {selectors} from '../selectors'
import {registrationTypes} from '../enums'

class EventView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: {}
    }
  }

  componentWillUnmount() {
    this.props.resetCurrentSessionEvent()
  }

  showEventEditionForm(sessionEvent) {
    this.setState({
      modal: {
        type: 'MODAL_EVENT_FORM',
        urlModal: null,
        props: {
          mode: 'edition',
          title: `${trans('session_event_edition', {}, 'cursus')}`,
          updateEventForm: this.props.updateEventForm,
          event: sessionEvent,
          confirmAction: this.props.editSessionEvent,
          resetFormData: this.props.resetEventForm,
          loadFormData: this.props.loadEventForm
        },
        fading: false
      }
    })
  }

  hideModal() {
    this.setState({modal: {fading: true, urlModal: null}})
  }

  render() {
    return (
      <div>
        <h3>{this.props.event.name}</h3>
        {this.props.canEdit ?
          <span className="pull-right">
            <button className="btn btn-primary margin-right-sm"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={trans('edit_session_event', {}, 'cursus')}
                    onClick={() => this.showEventEditionForm(this.props.event)}
            >
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-primary margin-right-sm"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={trans('register_participants', {}, 'cursus')}
            >
                <i className="fa fa-user-plus"></i>
            </button>
            <button className="btn btn-primary margin-right-sm"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={trans('invite_learners_to_session_event', {}, 'cursus')}
            >
                <i className="fa fa-plus-square"></i>
            </button>
            <button className="btn btn-primary margin-right-sm"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={trans('generate_event_certificates', {}, 'cursus')}
            >
                <i className="fa fa-graduation-cap"></i>
            </button>
            <button className="btn btn-primary"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={trans('informations_management', {}, 'cursus')}
            >
                <i className="fa fa-info"></i>
            </button>
          </span> :
          ''
        }
        <br/>
        <br/>
        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="description-heading">
              <h4 className="panel-title">
                <a role="button"
                   data-toggle="collapse"
                   data-parent="#accordion"
                   href="#description-collapse"
                   aria-expanded="true"
                   aria-controls="description-collapse"
                >
                  {trans('session_event_description', {}, 'cursus')}
                </a>
              </h4>
            </div>
            <div id="description-collapse"
                 className="panel-collapse collapse in"
                 role="tabpanel"
                 aria-labelledby="description-heading"
            >
              <div className="panel-body">
                <b>{t('duration')} :</b>
                &nbsp;
                {this.props.event['startDate']}
                &nbsp;
                <i className="fa fa-long-arrow-right"></i>
                &nbsp;
                {this.props.event['endDate']}
                <br/>
                <b>{trans('max_users', {} ,'cursus')} :</b>
                &nbsp;
                {this.props.event['maxUsers'] !== undefined ?
                  this.props.event['maxUsers'] :
                  '-'
                }
                <br/>
                <b>{t('registration')} :</b>
                &nbsp;
                {registrationTypes[this.props.event['registrationType']]}
                <hr/>
                {this.props.event['description'] ?
                  <div dangerouslySetInnerHTML={{__html: this.props.event['description']}}>
                  </div> :
                  <div className="alert alert-warning">
                    {trans('no_description', {}, 'cursus')}
                  </div>
                }
              </div>
            </div>
          </div>
          {this.props.canEdit ?
            <div className="panel panel-default">
              <div className="panel-heading" role="tab" id="participants-heading">
                <h4 className="panel-title">
                  <a role="button"
                     data-toggle="collapse"
                     data-parent="#accordion"
                     href="#participants-collapse"
                     aria-expanded="true"
                     aria-controls="participants-collapse"
                  >
                    {trans('participants', {}, 'cursus')}
                  </a>
                </h4>
              </div>
              <div id="participants-collapse"
                   className="panel-collapse collapse"
                   role="tabpanel"
                   aria-labelledby="participants-heading"
              >
                <div className="panel-body">
                </div>
              </div>
            </div> :
            ''
          }
        </div>
        {this.state.modal.type &&
          this.props.createModal(
            this.state.modal.type,
            this.state.modal.props,
            this.state.modal.fading,
            this.hideModal.bind(this)
          )
        }
        <br/>
        <a className="btn btn-default" href={'#'}>
          <i className="fa fa-arrow-left"></i>
          &nbsp;
          {t('back')}
        </a>
      </div>
    )
  }
}

EventView.propTypes = {
  event: T.shape({
    id: T.number,
    name: T.string,
    description: T.string,
    startDate: T.string,
    endDate: T.string,
    registrationType: T.number,
    maxUsers: T.number
  }).isRequired,
  canEdit: T.number.isRequired,
  resetCurrentSessionEvent: T.func.isRequired,
  editSessionEvent: T.func,
  resetEventForm: T.func,
  updateEventForm: T.func,
  loadEventForm: T.func,
  createModal: T.func
}

function mapStateToProps(state) {
  return {
    event: selectors.currentEvent(state),
    canEdit: selectors.canEdit(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetCurrentSessionEvent: () => {
      dispatch(actions.resetCurrentSessionEvent())
    },
    editSessionEvent: (eventId, eventData) => {
      dispatch(actions.editSessionEvent(eventId, eventData))
    },
    resetEventForm: () => dispatch(actions.resetEventForm()),
    updateEventForm: (property, value) => dispatch(actions.updateEventForm(property, value)),
    loadEventForm: (event) => dispatch(actions.loadEventForm(event)),
    createModal: (type, props, fading, hideModal) => makeModal(type, props, fading, hideModal, hideModal)
  }
}

const ConnectedEventView = connect(mapStateToProps, mapDispatchToProps)(EventView)

export {ConnectedEventView as EventView}