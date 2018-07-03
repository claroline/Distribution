/**
 * Widget creation store.
 */

import {registry} from '#/main/app/store/registry'

import {actions}   from '#/main/core/widget/modals/creation/store/actions'
import {reducer}   from '#/main/core/widget/modals/creation/store/reducer'
import {selectors} from '#/main/core/widget/modals/creation/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, reducer)

// export store module
export {
  actions,
  selectors
}
