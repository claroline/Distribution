/**
 * Path store.
 * Manages the state of a path resource.
 */

import {registry} from '#/main/app/store/registry'

import {actions}   from '#/plugin/path/resources/path/store/actions'
import {reducer}   from '#/plugin/path/resources/path/store/reducer'
import {selectors} from '#/plugin/path/resources/path/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, reducer)

// export store module
export {
  // action creators
  actions,
  // reducers
  reducer,
  // selectors
  selectors
}
