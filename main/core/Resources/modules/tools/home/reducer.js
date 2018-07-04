import {makeReducer} from '#/main/core/scaffolding/reducer'

import {reducer as editorReducer} from '#/main/core/tools/home/editor/reducer'
import {CURRENT_TAB} from '#/main/core/tools/home/actions'

const reducer = {
  title: makeReducer(null, {
    [CURRENT_TAB]: (state, action) => action.tabTitle
  }),
  tabs: makeReducer([], {}),
  widgets: makeReducer([], {}),
  editor: editorReducer
}

export {
  reducer
}
