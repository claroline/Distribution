import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {selectors} from '#/plugin/exo/resources/quiz/editor/modals/item-position/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME)

export {
  reducer
}
