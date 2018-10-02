import {makeReducer} from '#/main/app/store/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

import {
  CURRENT_TAB
} from '#/main/core/tools/home/store/actions'
import {reducer as editorReducer} from '#/main/core/tools/home/editor/store/reducer'

const reducer = {
  currentTabId: makeReducer(null, {
    [CURRENT_TAB]: (state, action) => action.tab
  }),
  tabs: makeReducer([], {
    [FORM_SUBMIT_SUCCESS+'/editor']: (state, action) => action.updatedData
  }),
  editor: editorReducer
}

export {
  reducer
}
