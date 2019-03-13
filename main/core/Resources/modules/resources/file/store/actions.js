import {API_REQUEST} from '#/main/app/api'
import {actions as resourceActions} from '#/main/core/resource/store/actions'

export const actions = {}

actions.download = (resourceNode) => ({
  [API_REQUEST]: {
    url: ['claro_resource_download', {
      ids: [resourceNode.id]
    }],
    forceDownload: true,
    request: {
      method: 'GET'
    },
    error: (response, status, dispatch) => {
      switch(status) {
        case 500: dispatch(resourceActions.setServerErrors(response)); break
      }
    }
  }
})

actions.createComment = (comment) => ({
  [API_REQUEST]: {
    url: ['apiv2_resourcecomment_create'],
    request: {
      method: 'POST',
      body: JSON.stringify(comment)
    },
    // success: (data, dispatch) => isPublic ? dispatch(actions.addComment(data)) : dispatch(actions.addInternalNote(data))
  }
})

actions.editComment = (comment) => ({
  [API_REQUEST]: {
    url: ['apiv2_resourcecomment_update', {id: comment.id}],
    request: {
      method: 'PUT',
      body: JSON.stringify(comment)
    },
    // success: (data, dispatch) => isPublic ? dispatch(actions.updateComment(data)) : dispatch(actions.updateInternalNote(data))
  }
})

actions.deleteComment = (commentId) => ({
  [API_REQUEST]: {
    url: ['apiv2_resourcecomment_delete_bulk', {ids: [commentId]}],
    request: {
      method: 'DELETE'
    },
    // success: (data, dispatch) => isPublic ? dispatch(actions.removeComment(commentId)) : dispatch(actions.removeInternalNote(commentId))
  }
})
