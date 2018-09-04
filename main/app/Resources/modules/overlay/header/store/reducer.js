import {combineReducers, makeReducer} from '#/main/app/store/reducer'

// TODO : this should be moved in the the main app store when available

const reducer = {
  workspaces: combineReducers({
    personal: makeReducer(null),
    current: makeReducer(null),
    history: makeReducer([])
  }),
  display: makeReducer({}),
  tools: makeReducer([]),
  userTools: makeReducer([]),
  administration: makeReducer([])
}

export {
  reducer
}
