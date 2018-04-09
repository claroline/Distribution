import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/api/router'

import {actions as entryActions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

const RESOURCE_PROPERTY_UPDATE = 'RESOURCE_PROPERTY_UPDATE'
const RESOURCE_PARAMS_PROPERTY_UPDATE = 'RESOURCE_PARAMS_PROPERTY_UPDATE'

const KEYWORD_ADD = 'KEYWORD_ADD'
const KEYWORD_UPDATE = 'KEYWORD_UPDATE'
const KEYWORDS_REMOVE = 'KEYWORDS_REMOVE'

const actions = {}

actions.updateResourceProperty = makeActionCreator(RESOURCE_PROPERTY_UPDATE, 'property', 'value')
actions.updateResourceParamsProperty = makeActionCreator(RESOURCE_PARAMS_PROPERTY_UPDATE, 'property', 'value')

actions.saveKeyword = (keyword) => (dispatch, getState) => {
  if (keyword.id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_clacoformkeyword_update', {id: keyword.id}],
        request: {
          method: 'PUT',
          body: JSON.stringify(keyword)
        },
        success: (data, dispatch) => {
          dispatch(actions.updateKeyword(data))
        }
      }
    })
  } else {
    const clacoFormId = getState().clacoForm.id
    keyword['clacoForm'] = {}
    keyword['clacoForm']['id'] = clacoFormId

    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_clacoformkeyword_create'],
        request: {
          method: 'POST',
          body: JSON.stringify(keyword)
        },
        success: (data, dispatch) => {
          dispatch(actions.addKeyword(data))
        }
      }
    })
  }
}

actions.deleteKeywords = (keywords) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_clacoformkeyword_delete_bulk') + '?' + keywords.map(k => 'ids[]=' + k.id).join('&'),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.removeKeywords(keywords.map(k => k.id)))
    }
  }
})

actions.addKeyword = makeActionCreator(KEYWORD_ADD, 'keyword')
actions.updateKeyword = makeActionCreator(KEYWORD_UPDATE, 'keyword')
actions.removeKeywords = makeActionCreator(KEYWORDS_REMOVE, 'ids')

actions.deleteAllEntries = () => (dispatch, getState) => {
  const resourceId = getState().clacoForm.id

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_all_entries_delete', {clacoForm: resourceId}],
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(entryActions.removeAllEntries())
      }
    }
  })
}

export {
  actions,
  RESOURCE_PROPERTY_UPDATE,
  RESOURCE_PARAMS_PROPERTY_UPDATE,
  KEYWORD_ADD,
  KEYWORD_UPDATE,
  KEYWORDS_REMOVE
}