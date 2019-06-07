import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  MENU_TOGGLE,
  MENU_CHANGE_SECTION,
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE
} from '#/main/app/layout/store/actions'

export const reducer = {
  maintenance: makeReducer(false),

  currentUser: makeReducer(null),
  impersonated: makeReducer(false),

  meta: combineReducers({
    name: makeReducer('Claroline Connect'),
    secondaryName: makeReducer('Easy & flexible learning'),
    version: makeReducer('12.4.8')
  }),

  menu: combineReducers({
    opened: makeReducer(true, {
      [MENU_TOGGLE]: (state) => !state
    }),
    section: makeReducer(null, {
      [MENU_CHANGE_SECTION]: (state, action) => action.section
    })
  }),

  sidebar: combineReducers({
    name: makeReducer(null, {
      [SIDEBAR_OPEN]: (state, action) => state !== action.toolName ? action.toolName : null,
      [SIDEBAR_CLOSE]: () => null
    })
  })
}
