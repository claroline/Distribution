import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {url} from '#/main/app/api'
import {actions as listActions} from '#/main/core/data/list/actions'

export const LAST_MESSAGES_LOAD = 'LAST_MESSAGES_LOAD'
export const actions = {}

actions.loadLastMessages = makeActionCreator(LAST_MESSAGES_LOAD, 'messages')
actions.fetchLastMessages = (forum) => ({
  [API_REQUEST]: {
    url: url(['apiv2_forum_message_list'])+'?limit='+forum.display.lastMessagesCount+'&sortBy=-id&filters[forum]='+forum.id,
    success: (data, dispatch) => {
      dispatch(actions.loadLastMessages(data))
    }
  }
})


actions.validateMessage = (message, subjectId) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {visible:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('moderation.blockedMessages'))
    }
  }
})
