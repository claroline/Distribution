import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {Event} from '#/plugin/agenda/components/event.jsx'

const EventModal = props =>
  <Modal
    icon="fa fa-fw fa-info"
    title={trans('event')}
    {...props}
  >
    <Event {...props.event}></Event>
  </Modal>

export {
  EventModal
}
