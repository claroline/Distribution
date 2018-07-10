/**
 * tab creation store.
 */

import {registry} from '#/main/app/store/registry'

import {reducer} from '#/main/core/tools/home/editor/modals/update/store/reducer'
import {selectors} from '#/main/core/tools/home/editor/modals/update/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, reducer)

// export store module
export {
  selectors
}
