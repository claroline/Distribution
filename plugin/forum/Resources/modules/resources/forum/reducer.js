import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'
import {now} from '#/main/core/scaffolding/date'
import {currentUser} from '#/main/core/user/current'
import {makeId} from '#/main/core/scaffolding/id'

import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import { MESSAGE_ADD } from '#/plugin/forum/resources/forum/actions'


const messagesReducer = makeReducer([], {
  [MESSAGE_ADD]: (state, action) => {

    const message = {
      id: makeId(),
      subjectId: action.subjectId,
      content: action.message,
      meta: {
        creator: currentUser(),
        created: now(),
        updated: now()
      }
    }

    return [
      ...state,
      message
    ]
  }
})

const reducer = makeResourceReducer({}, {
  forum: makeReducer({}, {}),
  subject: makeReducer({}, {}),
  messages: messagesReducer,
  forumForm: editorReducer
})

export {
  reducer
}
