import {makeReducer} from '#/main/core/utilities/redux'
import {
  MESSAGE_RESET,
  MESSAGE_UPDATE
} from './actions'

const messageReducers = makeReducer({}, {
  [MESSAGE_RESET]: () => {
    return {
      content: null,
      type: null
    }
  },
  [MESSAGE_UPDATE]: (state, action) => {
    return {
      content: action.content,
      type: action.status
    }
  }
})

export {
  messageReducers
}