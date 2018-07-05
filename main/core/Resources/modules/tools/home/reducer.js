import {makeReducer} from '#/main/core/scaffolding/reducer'

import {reducer as editorReducer} from '#/main/core/tools/home/editor/reducer'
import {
  CURRENT_TAB,
  TAB_EDIT,
  TAB_STOP_EDIT
} from '#/main/core/tools/home/actions'

const reducer = {
  editing: makeReducer(false, {
    [TAB_EDIT]: () => true,
    [TAB_STOP_EDIT]: () => false
  }),
  currentTabId: makeReducer(null, {
    [CURRENT_TAB]: (state, action) => action.tab
  }),
  tabs: makeReducer([], {}),
  editor: editorReducer
}

export {
  reducer
}
