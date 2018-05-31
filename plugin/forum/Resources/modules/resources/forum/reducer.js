
import {makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import {reducer as playerReducer} from '#/plugin/forum/resources/forum/player/reducer'



const reducer = {
  flaggedPosts: makeListReducer('flagged.messages', {}),
  forum: makeReducer({}, {}),
  forumForm: editorReducer,
  subjects: playerReducer
}

export {
  reducer
}
