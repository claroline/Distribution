import {makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {MESSAGE_LOAD, SET_TITLE} from '#/plugin/message/actions'


const reducer = {
  receivedMessages: makeListReducer('receivedMessages', {}),
  sentMessages: makeListReducer('sentMessages', {}),
  deletedMessages: makeListReducer('deletedMessages', {}),
  messageForm : makeFormReducer('messageForm'),
  currentMessage: makeReducer({}, {
    [MESSAGE_LOAD]: (state, action) => action.message
  }),
  title: makeReducer({}, {
    [SET_TITLE]: (state, action) => action.title
  })
}

export {
  reducer
}
