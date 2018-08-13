import {registry} from '#/main/app/store/registry'

import {reducer} from '#/main/core/resources/text/store/reducer'
import {selectors} from '#/main/core/resources/text/store/selectors'

// append the reducer to the store
registry.add(selectors.STORE_NAME, reducer)

export {
  reducer,
  selectors
}
