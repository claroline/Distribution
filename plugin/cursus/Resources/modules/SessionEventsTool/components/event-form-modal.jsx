import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
//import DatePicker from 'react-datepicker'
//import moment from 'moment'
//import 'react-datepicker/dist/react-datepicker.css'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {t, trans} from '#/main/core/translation'
import {Textarea} from '#/plugin/exo/components/form/textarea.jsx'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

const locale = getLocale()

export const MODAL_EVENT_FORM = 'MODAL_EVENT_FORM'

export class EventFormModal  extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    if (props.event.name) {
      this.state['name'] = props.event.name
    }
    if (props.event.description) {
      this.state['description'] = props.event.description
    }
    if (props.event.registrationType !== undefined) {
      this.state['registrationType'] = props.event.registrationType
    }
    if (props.event.maxUsers !== null) {
      this.state['maxUsers'] = props.event.maxUsers
    }
  }

  updateEventProps(property, value) {
    switch (property) {
      case 'name':
        this.setState({name: value})
        break
      case 'description':
        this.setState({description: value})
        break
      case 'registrationType':
        this.setState({registrationType: value})
        break
      case 'maxUsers':
        this.setState({maxUsers: value})
        break
    }
    this.props.updateEventForm(property, value)
  }

  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          <div className="form-group row">
            <div className="control-label col-md-3">
              <label>{t('name')}</label>
            </div>
            <div className="col-md-9">
              <input type="text"
                     className="form-control"
                     value={this.state.name}
                     onChange={e => this.props.updateEventForm('name', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="control-label col-md-3">
              <label>{t('description')}</label>
            </div>
            <div className="col-md-9">
              <Textarea id="event-form-description"
                        content={this.state.description}
                        onChange={text => this.props.updateEventForm('description', text)}
              >
              </Textarea>
            </div>
          </div>

          <div className="form-group row">
            <div className="control-label col-md-3">
              <label>{t('start_date')}</label>
            </div>
            <div className="col-md-9">
              <Datetime closeOnSelect={true}
                        dateFormat={true}
                        timeFormat={true}
                        locale={locale}
                        utc={true}
                        onChange={date => this.props.updateEventForm('startDate', date)}
              />
            </div>
          </div>


          <div className="form-group row">
            <div className="control-label col-md-3">
              <label>{trans('session_event_registration', {}, 'cursus')}</label>
            </div>
            <div className="col-md-9">
              <select className="form-control"
                      value={this.state.registrationType}
                      onChange={e => this.updateEventProps('registrationType', e.target.value)}
              >
                <option value="0">{trans('event_registration_automatic', {}, 'cursus')}</option>
                <option value="1">{trans('event_registration_manual', {}, 'cursus')}</option>
                <option value="2">{trans('event_registration_public', {}, 'cursus')}</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="control-label col-md-3">
              <label>{trans('max_users', {}, 'cursus')}</label>
            </div>
            <div className="col-md-9">
              <input type="number"
                     className="form-control"
                     value={this.state.maxUsers}
                     min="0"
                     onChange={e => this.props.updateEventForm('maxUsers', e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" onClick={() => {}}>
            {t('ok')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

EventFormModal.propTypes = {
  event: T.shape({
    id: T.number,
    name: T.string,
    description: T.string,
    startDate: T.string,
    endDate: T.string,
    registrationType: T.number.isRequired,
    maxUsers: T.number
  }).isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,
  updateEventForm: T.func.isRequired
}

function getLocale() {
  const homeLocale = document.querySelector('#homeLocale')

console.log(homeLocale.innerHTML)
  if (homeLocale) {
    return homeLocale.innerHTML.trim()
  }
  return 'en'
}
