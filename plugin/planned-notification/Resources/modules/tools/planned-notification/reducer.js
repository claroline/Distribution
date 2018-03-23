import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'

import {reducer as messagesReducer} from '#/plugin/planned-notification/tools/planned-notification/message/reducer'

const reducer = makePageReducer({}, {
  canEdit: makeReducer({}, {}),
  workspace: makeReducer({}, {}),
  messages: messagesReducer
})

export {
  reducer
}