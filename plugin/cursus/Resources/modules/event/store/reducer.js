import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {LOAD_EVENT} from '#/plugin/cursus/event/store/actions'

export const reducer = combineReducers({
  event: makeReducer(null, {
    [LOAD_EVENT]: (state, action) => action.event
  }),
  registrations: makeReducer(null, {
    [LOAD_EVENT]: (state, action) => action.registrations
  })
})
