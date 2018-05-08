import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'
import {now} from '#/main/core/scaffolding/date'
import {currentUser} from '#/main/core/user/current'
import {makeId} from '#/main/core/scaffolding/id'

import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import {reducer as playerReducer} from '#/plugin/forum/resources/forum/player/reducer'

import {
  MESSAGE_ADD,
  MESSAGE_REMOVE,
  COMMENT_ADD
} from '#/plugin/forum/resources/forum/actions'


const messagesReducer = makeReducer([], {
  [MESSAGE_ADD]: (state, action) => {

    const message = {
      id: makeId(),
      subjectId: action.subjectId,
      content: action.message.content,
      meta: {
        creator: currentUser(),
        created: now(),
        updated: now()
      },
      comments: []
    }

    return [
      ...state,
      message
    ]
  },
  [MESSAGE_REMOVE]: (state, action) => {
    const messages = cloneDeep(state)
    const index = messages.findIndex(c => c.id === action.messageId)

    if (index >= 0) {
      messages.splice(index, 1)
    }

    return messages
  },
  [COMMENT_ADD]: (state, action) => {
    const messages = cloneDeep(state)
    const message = messages.find(message => message.id === action.messageId)

    if (message != null) {
      message.comments.push({
        id: makeId(),
        content: action.comment,
        meta: {
          creator: currentUser(),
          created: now(),
          updated: now()
        }
      })
    }

    return messages
  }
})

const reducer = makeResourceReducer({}, {
  forum: makeReducer({}, {}),
  messages: messagesReducer,
  forumForm: editorReducer,
  subjects: playerReducer
})

export {
  reducer
}
