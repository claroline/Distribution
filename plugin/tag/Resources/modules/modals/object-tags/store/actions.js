import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST, url} from '#/main/app/api'

export const TAGS_LOAD = 'TAGS_LOAD'
export const TAG_ADD = 'TAG_ADD'
export const TAG_DELETE = 'TAG_DELETE'

export const actions = {}

actions.loadTags = makeActionCreator(TAGS_LOAD, 'tags')
actions.fetchTags = (objectClass, objects) => ({
  [API_REQUEST]: {
    url: url(['apiv2_tag_list'], {
      filters: {
        objectClass: objectClass,
        objectId: objects.map(object => object.id)
      }
    }),
    success: (response, dispatch) => dispatch(actions.loadTags(response.data))
  }
})

actions.addTag = makeActionCreator(TAG_ADD, 'tag')
actions.postTag = (objectClass, objects, tag) => ({
  [API_REQUEST]: {
    url: ['apiv2_tag_add_objects', {tag: tag.name}],
    request: {
      method: 'POST',
      body: JSON.stringify(objects.map(object => ({
        class: objectClass,
        id: object.id,
        name: object.name
      })))
    },
    success: (response, dispatch) => dispatch(actions.addTag(response))
  }
})

actions.deleteTag = makeActionCreator(TAG_DELETE, 'tag')
actions.removeTag = (objectClass, objects, tag) => ({
  [API_REQUEST]: {
    url: ['apiv2_tag_remove_objects', {id: tag.id}],
    request: {
      method: 'DELETE',
      body: JSON.stringify(objects.map(object => ({
        class: objectClass,
        id: object.id,
        name: object.name
      })))
    },
    success: (response, dispatch) => dispatch(actions.deleteTag(tag))
  }
})
