import {API_REQUEST} from '#/main/app/api'

import {selectors} from '#/plugin/claco-form/resources/claco-form/store/selectors'
import {actions as clacoFormActions} from '#/plugin/claco-form/resources/claco-form/store/actions'
import {actions as editorActions} from '#/plugin/claco-form/resources/claco-form/editor/store/actions'

export const actions = {}

actions.saveTemplate = (template, useTemplate) => (dispatch, getState) => {
  const clacoFormId = selectors.clacoForm(getState()).id
  const formData = new FormData()
  formData.append('template', template)
  formData.append('useTemplate', useTemplate ? 1 : 0)

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_template_edit', {clacoForm: clacoFormId}],
      request: {
        method: 'POST',
        body: formData,
        headers: new Headers({
          //no Content type for automatic detection of boundaries.
          'X-Requested-With': 'XMLHttpRequest'
        })
      },
      success: (data, dispatch) => {
        dispatch(editorActions.updateResourceProperty('template', data.template))
        dispatch(editorActions.updateResourceParamsProperty('use_template', data.useTemplate))
        dispatch(clacoFormActions.resetMessage())
      }
    }
  })
}
