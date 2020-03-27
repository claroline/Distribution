import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/core/modals/templates/store/selectors'

const reducer = makeListReducer(selectors.STORE_NAME)

export {
  reducer
}
