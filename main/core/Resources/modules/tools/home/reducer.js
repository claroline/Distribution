import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeToolReducer} from '#/main/core/tool/reducer'

import {reducer as editorReducer} from '#/main/core/tools/home/editor/reducer'

const reducer = makeToolReducer({}, {
  title: makeReducer(null, {}),
  tabs: makeReducer([], {}),
  widgets: makeReducer([], {}),
  editor: editorReducer
})

export {
  reducer
}
