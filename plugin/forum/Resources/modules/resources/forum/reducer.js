

import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'


import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import {reducer as playerReducer} from '#/plugin/forum/resources/forum/player/reducer'



const reducer = makeResourceReducer({}, {
  forum: makeReducer({}, {}),
  forumForm: editorReducer,
  subjects: playerReducer
})

export {
  reducer
}
