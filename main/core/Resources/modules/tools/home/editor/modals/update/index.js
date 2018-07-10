/**
 * Tab creation modal.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {UpdateTabModal} from '#/main/core/tools/home/editor/modals/update/components/update'

const MODAL_TAB_UPDATE = 'MODAL_TAB_UPDATE'

// make the modal available for use
registry.add(MODAL_TAB_UPDATE, UpdateTabModal)

export {
  MODAL_TAB_UPDATE
}
