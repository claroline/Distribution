import {makeReducer, combineReducers} from '#/main/core/utilities/redux'

import {

  THEMES_REMOVE
} from './actions'

const reducer = makeReducer([], {

  [THEMES_REMOVE]: (state, action) => {
    console.log('COUCOU remove')
    return state
  }
})

export {
  reducer
}
