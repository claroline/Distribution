/**
 * Workspace parameters store.
 */

import {registry} from '#/main/app/store/registry'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {selectors} from '#/main/core/workspace/parameters/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, makeFormReducer(selectors.STORE_NAME))

// export store module
export {
  // selectors
  selectors
}
