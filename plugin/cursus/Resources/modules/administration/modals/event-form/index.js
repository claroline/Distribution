/**
 * Session event form modal.
 * Displays a form to create a session event.
 */

import {registry} from '#/main/app/modals/registry'

import {EventFormModal} from '#/plugin/cursus/administration/modals/event-form/containers/modal'

const MODAL_SESSION_EVENT_FORM = 'MODAL_SESSION_EVENT_FORM'

registry.add(MODAL_SESSION_EVENT_FORM, EventFormModal)

export {
  MODAL_SESSION_EVENT_FORM
}
