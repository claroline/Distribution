import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {selectors} from '#/main/core/badge/badges/components/modals/evidence/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME, {
})

export {
  reducer
}
