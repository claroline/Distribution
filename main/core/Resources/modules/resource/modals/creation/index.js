/**
 * Resource Creation modal.
 *
 * The creation is split into two modals :
 *   - A first one, where the user select the type to create
 *   - A second one, where the user can configure the resource
 *
 * NB. Only the first modal is public to be sure resource creation
 * always follow the same process
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {ResourceTypeModal} from '#/main/core/resource/modals/creation/components/resource-type'

const MODAL_RESOURCE_CREATION = 'MODAL_RESOURCE_CREATION'

// make the modal available for use
registry.add(MODAL_RESOURCE_CREATION, ResourceTypeModal)

export {
  MODAL_RESOURCE_CREATION
}
