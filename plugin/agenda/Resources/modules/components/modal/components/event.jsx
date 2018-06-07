import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {trans} from '#/main/core/translation'

import {Modal} from '#/main/app/overlay/modal/components/modal'
import {Event} from '#/plugin/agenda/components/event.jsx'

const EventModal = props =>
  <Modal
    icon="fa fa-fw fa-info"
    title={trans('event')}
    {...props}
  >
    <Event {...props.event} onForm={props.onForm}></Event>
  </Modal>

function mapDispatchToProps(dispatch) {
  return {
    fadeModal: () => dispatch(modalActions.fadeModal()),
    hideModal: () => dispatch(modalActions.hideModal())
  }
}

const ConnectedEventModal = connect(null, mapDispatchToProps)(EventModal)

export {
  ConnectedEventModal as EventModal
}
