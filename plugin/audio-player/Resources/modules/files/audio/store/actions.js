import cloneDeep from 'lodash/cloneDeep'

import {API_REQUEST} from '#/main/app/api'

import {actions as fileActions} from '#/main/core/resources/file/store/actions'

const actions = {}

actions.saveSectionComment = (sections, sectionId, comment) => ({
  [API_REQUEST]: {
    url: comment.id ? ['apiv2_audioresourcesectioncomment_update', {id: comment.id}] : ['apiv2_audioresourcesectioncomment_create'],
    request: {
      method: comment.id ? 'PUT' : 'POST',
      body: JSON.stringify(comment)
    },
    success: (data, dispatch) => {
      const newSections = cloneDeep(sections)
      const index = newSections.findIndex(s => s.id === sectionId)

      if (-1 < index) {
        newSections[index]['comment'] = data
      }
      dispatch(fileActions.updateFileProp('sections', newSections))
    }
  }
})

actions.deleteSectionComment = (sections, sectionId, commentId) => ({
  [API_REQUEST]: {
    url: ['apiv2_audioresourcesectioncomment_delete_bulk', {ids: [commentId]}],
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      const newSections = cloneDeep(sections)
      const index = newSections.findIndex(s => s.id === sectionId)

      if (-1 < index) {
        newSections[index]['comment'] = null
      }
      dispatch(fileActions.updateFileProp('sections', newSections))
    }
  }
})

export {
  actions
}