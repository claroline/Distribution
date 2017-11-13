import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {select} from '../selectors'
import {generateCorrection} from '../utils'

export const DROPS_LOAD = 'DROPS_LOAD'
export const CURRENT_DROP_LOAD = 'CURRENT_DROP_LOAD'
export const CURRENT_DROP_RESET = 'CURRENT_DROP_RESET'
export const CORRECTION_FORM_LOAD = 'CORRECTION_FORM_LOAD'
export const CORRECTION_FORM_RESET = 'CORRECTION_FORM_RESET'
export const CORRECTION_FORM_UPDATE = 'CORRECTION_FORM_UPDATE'
export const CORRECTION_FORM_CRITERION_UPDATE = 'CORRECTION_FORM_CRITERION_UPDATE'
export const CORRECTION_UPDATE = 'CORRECTION_UPDATE'
export const CORRECTION_REMOVE = 'CORRECTION_REMOVE'

export const actions = {}

actions.loadDrops = makeActionCreator(DROPS_LOAD, 'drops')

actions.fetchDrops = (dropzoneId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_drops_search', {id: dropzoneId}),
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => {
      dispatch(actions.loadDrops(data))
    }
  }
})

actions.loadCurrentDrop = makeActionCreator(CURRENT_DROP_LOAD, 'drop')
actions.resetCurrentDrop = makeActionCreator(CURRENT_DROP_RESET)

actions.fetchDrop = (dropId) => (dispatch, getState) => {
  const dropsData = select.drops(getState())
  let drop = null

  if (dropsData.data) {
    drop = dropsData.data.find(d => d.id === dropId)
  }
  if (drop) {
    dispatch(actions.loadCurrentDrop(drop))
  } else {
    dispatch({
      [REQUEST_SEND]: {
        url: generateUrl('claro_dropzone_drop_fetch', {id: dropId}),
        request: {
          method: 'GET'
        },
        success: (data, dispatch) => {
          dispatch(actions.loadCurrentDrop(data))
        }
      }
    })
  }
}

actions.loadCorrectionForm = makeActionCreator(CORRECTION_FORM_LOAD, 'correction')
actions.resetCorrectionForm = makeActionCreator(CORRECTION_FORM_RESET)
actions.updateCorrectionForm = makeActionCreator(CORRECTION_FORM_UPDATE, 'property', 'value')
actions.updateCorrectionFormCriterion = makeActionCreator(CORRECTION_FORM_CRITERION_UPDATE, 'criterionId', 'value')
actions.updateCorrection = makeActionCreator(CORRECTION_UPDATE, 'correction')
actions.removeCorrection = makeActionCreator(CORRECTION_REMOVE, 'correctionId')

actions.loadNewCorrection = (id, dropId) => (dispatch, getState) => {
  const state = getState()
  const user = select.user(state)
  const dropzone = select.dropzone(state)
  const correction = generateCorrection(id, dropId, user, dropzone)

  dispatch(actions.loadCorrectionForm(correction))
}

actions.saveCorrection = (correction) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_correction_save', {id: correction.drop}),
    request: {
      method: 'POST',
      body: JSON.stringify(correction)
    },
    success: (data, dispatch) => {
      dispatch(actions.updateCorrection(data))
    }
  }
})

actions.submitCorrection = (correctionId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_correction_submit', {id: correctionId}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateCorrection(data))
    }
  }
})

actions.switchCorrectionValidation = (correctionId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_correction_validation_switch', {id: correctionId}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateCorrection(data))
    }
  }
})

actions.deleteCorrection = (correctionId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_correction_delete', {id: correctionId}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.removeCorrection(correctionId))
    }
  }
})