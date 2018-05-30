
import {makeReducer} from '#/main/app/store/reducer'


import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import {reducer as playerReducer} from '#/plugin/forum/resources/forum/player/reducer'



const reducer = {
  forum: makeReducer({}, {}),
  forumForm: editorReducer,
  subjects: playerReducer
}

export {
  reducer
}
