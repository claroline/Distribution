import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE
} from '#/main/app/layout/store/actions'

// menu
import {reducer as menuReducer} from '#/main/app/layout/menu/store/reducer'
import {selectors as menuSelectors} from '#/main/app/layout/menu/store/selectors'

export const reducer = {
  maintenance: makeReducer(false),

  currentUser: makeReducer(null),
  impersonated: makeReducer(false),

  meta: combineReducers({
    name: makeReducer('Claroline Connect'),
    secondaryName: makeReducer('Easy & flexible learning'),
    version: makeReducer('12.4.8')
  }),

  [menuSelectors.STORE_NAME]: menuReducer,

  sidebar: combineReducers({
    name: makeReducer(null, {
      [SIDEBAR_OPEN]: (state, action) => state !== action.toolName ? action.toolName : null,
      [SIDEBAR_CLOSE]: () => null
    })
  })
}
