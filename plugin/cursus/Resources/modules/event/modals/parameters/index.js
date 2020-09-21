/**
 * Session event form modal.
 * Displays a form to create a session event.
 */

import {registry} from '#/main/app/modals/registry'

import {EventFormModal} from '#/plugin/cursus/event/modals/parameters/containers/modal'

const MODAL_SESSION_EVENT_PARAMETERS = 'MODAL_SESSION_EVENT_PARAMETERS'

registry.add(MODAL_SESSION_EVENT_PARAMETERS, EventFormModal)

export {
  MODAL_SESSION_EVENT_PARAMETERS
}
