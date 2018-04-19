import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'

import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'

const reducer = makeResourceReducer({}, {
  forum: makeReducer({}, {}),
  subject: makeReducer({}, {}),
  messages: makeReducer({}, {}),
  forumForm: editorReducer
})

export {
  reducer
}
