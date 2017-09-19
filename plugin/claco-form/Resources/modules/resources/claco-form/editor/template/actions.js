import {generateUrl} from '#/main/core/fos-js-router'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {trans} from '#/main/core/translation'
import {actions as clacoFormActions} from '../../actions'
import {actions as editorActions} from '../actions'

export const TEMPLATE_UPDATE = 'TEMPLATE_UPDATE'

export const actions = {}

actions.updateTemplate = makeActionCreator(TEMPLATE_UPDATE, 'template')

actions.initializeTemplate = () => (dispatch, getState) => {
  const template = getState().resource.template || ''
  dispatch(actions.updateTemplate(template))
}

actions.saveTemplate = () => (dispatch, getState) => {
  const state = getState()
  const resourceId = state.resource.id
  const template = state.template
  const formData = new FormData()
  formData.append('template', template)

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_template_edit', {clacoForm: resourceId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(editorActions.updateResourceProperty('template', data.template))
        dispatch(clacoFormActions.updateMessage(trans('template_success_message', {}, 'clacoform'), 'success'))
      }
    }
  })
}
