/**
 * Widget parameters store.
 */

import {registry} from '#/main/app/store/registry'

import {actions} from '#/main/core/widget/modals/parameters/store/actions'
import {reducer} from '#/main/core/widget/modals/parameters/store/reducer'
import {selectors} from '#/main/core/widget/modals/parameters/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, reducer)

// export store module
export {
  actions,
  selectors
}
