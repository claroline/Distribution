import {registry} from '#/main/app/modals/registry'

import {MODAL_DATA_FORM, DataFormModal} from '#/main/core/data/form/modals/components/data-form'

// make the modal available for use
registry.add(MODAL_DATA_FORM, DataFormModal)

export {
  MODAL_DATA_FORM
}
