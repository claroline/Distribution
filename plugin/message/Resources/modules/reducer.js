import {combineReducers} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'


const reducer = combineReducers({
  receivedMessages: makeListReducer('messagesReceived', {}),
  sentMessages: makeListReducer('messagesSent', {}),
  deletedMessages: makeListReducer('messagesDeleted', {}),
  messageForm : makeFormReducer('messageForm')
})

export {
  reducer
}
