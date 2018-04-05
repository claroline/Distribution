import {trans} from '#/main/core/translation'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'

import {actions as entryActions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

export const RESOURCE_PROPERTY_UPDATE = 'RESOURCE_PROPERTY_UPDATE'
export const RESOURCE_PARAMS_PROPERTY_UPDATE = 'RESOURCE_PARAMS_PROPERTY_UPDATE'

export const actions = {}

actions.updateResourceProperty = makeActionCreator(RESOURCE_PROPERTY_UPDATE, 'property', 'value')
actions.updateResourceParamsProperty = makeActionCreator(RESOURCE_PARAMS_PROPERTY_UPDATE, 'property', 'value')

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