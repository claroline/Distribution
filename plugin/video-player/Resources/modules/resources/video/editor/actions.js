import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {url} from '#/main/app/api'

const SUBTITLE_ADD = 'SUBTITLE_ADD'
const SUBTITLE_UPDATE = 'SUBTITLE_UPDATE'
const SUBTITLE_REMOVE = 'SUBTITLE_REMOVE'

const actions = {}

actions.saveSubtitle = (track) => (dispatch) => {
  if (track.autoId) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_videotrack_update'],
        request: {
          method: 'PUT',
          body: JSON.stringify(track)
        },
        success: (data, dispatch) => {
          dispatch(actions.updateSubtitle(data))
        }
      }
    })
  } else {
    const formData = new FormData()
    formData.append('track', JSON.stringify(track))
    formData.append('file', track.file)

    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_videotrack_create'],
        request: {
          method: 'POST',
          body: formData
        },
        success: (data, dispatch) => {
          dispatch(actions.addSubtitle(data))
        }
      }
    })
  }
}

actions.deleteSubtitle = (id) => ({
  [API_REQUEST]: {
    url: url(['apiv2_videotrack_delete_bulk'], {ids: [id]}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => dispatch(actions.removeSubtitle(id))
  }
})

actions.addSubtitle = makeActionCreator(SUBTITLE_ADD, 'subtitle')
actions.updateSubtitle = makeActionCreator(SUBTITLE_UPDATE, 'subtitle')
actions.removeSubtitle = makeActionCreator(SUBTITLE_REMOVE, 'id')

export {
  actions,
  SUBTITLE_ADD,
  SUBTITLE_UPDATE,
  SUBTITLE_REMOVE
}