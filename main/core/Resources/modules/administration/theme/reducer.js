import {makeReducer} from '#/main/core/utilities/redux'

import {
  THEMES_REMOVE
} from './actions'

const reducer = makeReducer([], {
  [THEMES_REMOVE]: (state) => {
    return state
  }
})

export {
  reducer
}
