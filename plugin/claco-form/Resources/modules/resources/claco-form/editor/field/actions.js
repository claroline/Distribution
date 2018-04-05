import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'

export const FIELD_ADD = 'FIELD_ADD'
export const FIELD_UPDATE = 'FIELD_UPDATE'
export const FIELD_REMOVE = 'FIELD_REMOVE'

export const actions = {}

actions.addField = makeActionCreator(FIELD_ADD, 'field')
actions.updateField = makeActionCreator(FIELD_UPDATE, 'field')
actions.removeField = makeActionCreator(FIELD_REMOVE, 'fieldId')

actions.createField = (fieldData) => (dispatch, getState) => {
  const resourceId = getState().clacoForm.id
  const formData = new FormData()
  formData.append('fieldData', JSON.stringify(fieldData.field))
  formData.append('choicesData', JSON.stringify(fieldData.choices))
  formData.append('choicesChildrenData', JSON.stringify(fieldData.choicesChildren))

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_field_create', {clacoForm: resourceId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addField(data))
      }
    }
  })
}

actions.editField = (fieldData) => (dispatch) => {
  const formData = new FormData()
  formData.append('fieldData', JSON.stringify(fieldData.field))
  formData.append('choicesData', JSON.stringify(fieldData.choices))
  formData.append('choicesChildrenData', JSON.stringify(fieldData.choicesChildren))

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_field_edit', {field: fieldData.field.id}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        if (data.fieldFacet && data.fieldFacet.field_facet_choices) {
          data.fieldFacet.field_facet_choices = Object.values(data.fieldFacet.field_facet_choices)
        }
        dispatch(actions.updateField(data))
      }
    }
  })
}

actions.deleteField = (fieldId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_field_delete', {field: fieldId}],
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.removeField(fieldId))
      }
    }
  })
}
