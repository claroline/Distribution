import {TOOL_LOAD} from '#/main/core/tool/store/actions'

import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/core/tools/users/store/selectors'

import {
  PROFILE_FACET_OPEN
} from '#/main/core/user/profile/store/actions'

const reducer = combineReducers({
  currentFacet: makeReducer(null, {
    [PROFILE_FACET_OPEN]: (state, action) => action.id
  }),
  facets: makeReducer([], {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.facets}
  ),
  user: makeFormReducer(selectors.STORE_NAME + '.user', {}, {
    originalData: makeReducer({}, {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.user.originalData
    }),
    data: makeReducer({}, {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.user.data
    })
  }),
  parameters: makeReducer({}, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.parameters}
  ),
  badges: combineReducers({
    mine: makeListReducer(selectors.STORE_NAME + '.badges.mine', {})
  })
})

export {
  reducer
}
