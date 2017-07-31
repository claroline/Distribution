import {makeReducer, combineReducers} from '#/main/core/utilities/redux'

import {
  THEME_ADD,
  THEMES_REMOVE
} from './actions'

const reducer = makeReducer([], {
  [THEME_ADD]: (state, action) => {
    return state
  },
  [THEMES_REMOVE]: (state, action) => {
    console.log('COUCOU remove')
    return state
  }
})

export {
  reducer
}
