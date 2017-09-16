import {generateUrl} from '#/main/core/fos-js-router'
import {trans} from '#/main/core/translation'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as messageActions} from '../message/actions'

export const RESOURCE_PROPERTY_UPDATE = 'RESOURCE_PROPERTY_UPDATE'
export const PARAMETERS_INITIALIZE = 'PARAMETERS_INITIALIZE'
export const PARAMETERS_UPDATE = 'PARAMETERS_UPDATE'
export const MESSAGE_RESET = 'MESSAGE_RESET'
export const MESSAGE_UPDATE = 'MESSAGE_UPDATE'

export const actions = {}

actions.updateResourceProperty = makeActionCreator(RESOURCE_PROPERTY_UPDATE, 'property', 'value')
actions.setParameters = makeActionCreator(PARAMETERS_INITIALIZE, 'params')
actions.updateParameters = makeActionCreator(PARAMETERS_UPDATE, 'property', 'value')

actions.initializeParameters = () => (dispatch, getState) => {
  const params = Object.assign({}, getState().resource.details, {'activePanelKey': ''})
  dispatch(actions.setParameters(params))
}

actions.saveParameters = () => (dispatch, getState) => {
  const state = getState()
  const resourceId = state.resource.id
  const params = state.parameters
  const formData = new FormData()
  formData.append('configData', JSON.stringify(params))

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_configuration_edit', {clacoForm: resourceId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.updateResourceProperty('details', data))
        dispatch(messageActions.updateMessage(trans('config_success_message', {}, 'clacoform'), 'success'))
      }
    }
  })
}