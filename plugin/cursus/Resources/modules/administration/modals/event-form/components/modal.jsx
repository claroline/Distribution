import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {trans} from '#/main/app/intl/translation'

import {SessionEventForm} from '#/plugin/cursus/administration/cursus/session-event/components/form'
import {selectors} from '#/plugin/cursus/administration/modals/event-form/store'

const EventFormModal = props =>
  <Modal
    {...omit(props, 'event', 'session', 'saveEnabled', 'loadEvent', 'saveEvent', 'onSave')}
    icon={props.event && props.event.id ? 'fa fa-fw fa-cog' : 'fa fa-fw fa-plus'}
    title={trans('session_events', {}, 'cursus')}
    subtitle={props.event && props.event.id ? props.event.name : trans('new_event', {}, 'cursus')}
    onEntering={() => props.loadEvent(props.event, props.session)}
  >
    <SessionEventForm
      name={selectors.STORE_NAME}
    >
      <Button
        className="modal-btn btn"
        type={CALLBACK_BUTTON}
        htmlType="submit"
        primary={true}
        label={trans('save', {}, 'actions')}
        disabled={!props.saveEnabled}
        callback={() => props.saveEvent(props.event ? props.event.id : null, (data) => {
          props.onSave(data)
          props.fadeModal()
        })}
      />
    </SessionEventForm>
  </Modal>

EventFormModal.propTypes = {
  event: T.shape({
    id: T.string.isRequired
  }),
  session: T.shape({

  }),
  saveEnabled: T.bool.isRequired,
  loadEvent: T.func.isRequired,
  saveEvent: T.func.isRequired,
  onSave: T.func.isRequired,

  // from modal
  fadeModal: T.func.isRequired
}

export {
  EventFormModal
}
