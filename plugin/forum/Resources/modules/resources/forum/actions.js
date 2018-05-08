import {makeActionCreator} from '#/main/core/scaffolding/actions'

import {API_REQUEST} from '#/main/core/api/actions'

export const actions = {}

export const MESSAGE_ADD = 'MESSAGE_ADD'
export const MESSAGE_REMOVE = 'MESSAGE_REMOVE'
export const COMMENT_ADD = 'COMMENT_ADD'

actions.addSubjectMessage = makeActionCreator(MESSAGE_ADD, 'subjectId', 'message')
actions.createMessage = (subjectId, message) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_forum_message_create', {subject: subjectId}],
      request: {
        method: 'POST',
        body: JSON.stringify({content: message})
      },
      success: (data, dispatch) => {
        dispatch(actions.addSubjectMessage(subjectId, data))
      }
    }
  })
}

actions.removeMessage = makeActionCreator(MESSAGE_REMOVE, 'messageId')
actions.deleteMessage = (messageId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_forum_message_delete_bulk', {message: messageId}],
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.removeMessage(messageId))
      }
    }
  })
}

actions.addMessageComment = makeActionCreator(COMMENT_ADD, 'messageId', 'comment')
actions.createComment = (messageId, comment) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claroline_forum_api_message_createcomment', {message: messageId}],
      request: {
        method: 'POST',
        body: JSON.stringify({content: comment})
      },
      success: (data, dispatch) => {
        dispatch(actions.addMessageComment(messageId, data))
      }
    }
  })
}
