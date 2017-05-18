import {generateUrl} from '#/main/core/fos-js-router'
import { REQUEST_SEND } from '#/plugin/exo/api/actions'

export const actions = {
  deleteSessionEvent: (workspaceId, sessionEventId) => ({
    [REQUEST_SEND] : {
      url: generateUrl('claro_cursus_session_event_delete', {workspace: workspaceId, sessionEvent: sessionEventId}),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {

      },
      failure: () => alert('fail')
    }
  })
}