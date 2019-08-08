import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'
import {TOOL_LOAD} from '#/main/core/tool/store/actions'

import {CURRENT_TAB} from '#/main/core/tools/home/store/actions'
import {selectors} from '#/main/core/tools/home/store/selectors'
import {reducer as editorReducer} from '#/main/core/tools/home/editor/store/reducer'

const reducer = combineReducers({
  administration: makeReducer(false, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.administration || false
  }),
  editable: makeReducer(false, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.editable || false
  }),

  currentTabId: makeReducer(null, {
    [CURRENT_TAB]: (state, action) => action.tab
  }),

  tabs: makeReducer([], {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.tabs,
    [makeInstanceAction(FORM_SUBMIT_SUCCESS, selectors.STORE_NAME + '.editor')]: (state, action) => action.updatedData
  }),

  roles: makeReducer([], {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.roles || []
  }),

  editor: editorReducer
})

export {
  reducer
}
