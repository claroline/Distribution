import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {MENU_TOGGLE} from '#/main/app/layout/store/actions'

export const reducer = {
  maintenance: makeReducer(false),

  currentUser: makeReducer(null),
  impersonated: makeReducer(false),

  meta: combineReducers({
    name: makeReducer('Claroline Connect'),
    secondaryName: makeReducer('Easy & flexible learning'),
    version: makeReducer('12.4.8')
  }),

  menuOpened: makeReducer(true, {
    [MENU_TOGGLE]: (state) => !state
  })
}
