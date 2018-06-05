import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {url} from '#/main/app/api'

export const LAST_MESSAGES_LOAD = 'LAST_MESSAGES_LOAD'
export const actions = {}

actions.loadLastMessages = makeActionCreator(LAST_MESSAGES_LOAD, 'messages')
actions.fetchLastMessages = (forumId) => ({
  [API_REQUEST]: {
    url: url(['apiv2_forum_message_list'])+'?page=1&limit=5&sortBy=-id&filters[forum]='+forumId,
    success: (data, dispatch) => {
      dispatch(actions.loadLastMessages(data))
    }
  }
})
