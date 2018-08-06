import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'


const reducer = {
  receivedMessages: makeListReducer('receivedMessages', {}),
  sentMessages: makeListReducer('sentMessages', {}),
  deletedMessages: makeListReducer('deletedMessages', {}),
  messageForm : makeFormReducer('messageForm')
}

export {
  reducer
}
