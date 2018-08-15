import {makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {MESSAGE_LOAD, IS_REPLY} from '#/plugin/message/actions'


const reducer = {
  receivedMessages: makeListReducer('receivedMessages', {}),
  sentMessages: makeListReducer('sentMessages', {}),
  deletedMessages: makeListReducer('deletedMessages', {}),
  messagesParameters: makeFormReducer('messagesParameters'),
  messageForm : makeFormReducer('messageForm', {
    reply: false
  }, {
    reply: makeReducer(false, {
      [IS_REPLY]: () => true
    })
  }),
  currentMessage: makeReducer({}, {
    [MESSAGE_LOAD]: (state, action) => action.message
  })
}

export {
  reducer
}
