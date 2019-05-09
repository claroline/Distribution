import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {DESKTOP_LOAD, DESKTOP_INVALIDATE} from '#/main/app/layout/sections/desktop/store/actions'

const reducer = combineReducers({
  loaded: makeReducer(false, {
    [DESKTOP_LOAD]: () => true,
    [DESKTOP_INVALIDATE]: () => false
  }),

  /**
   * The list of available tools on the desktop.
   */
  tools: makeReducer([], {
    [DESKTOP_LOAD]: (state, action) => action.desktopData.tools || []
  }),

  /**
   * The current user progression.
   */
  userProgression: makeReducer(null, {
    [DESKTOP_LOAD]: (state, action) => action.desktopData.userProgression || null
  })
})

export {
  reducer
}
