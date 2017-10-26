import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import {makeReducer} from '#/main/core/utilities/redux'
import {validate} from './validator'
import {generateId} from '../utils'
import {
  DROPZONE_FORM_LOAD,
  DROPZONE_FORM_RESET,
  DROPZONE_FORM_VALIDATE,
  DROPZONE_PARAMETERS_UPDATE,
  DROPZONE_DISPLAY_UPDATE,
  DROPZONE_NOTIFICATIONS_UPDATE,
  DROPZONE_CRITERION_ADD,
  DROPZONE_CRITERION_UPDATE,
  DROPZONE_CRITERION_REMOVE
} from './actions'

const reducer = makeReducer({
  validating: false,
  pendingChanges: false,
  errors: {},
  data: null
}, {
  [DROPZONE_FORM_RESET]: () => ({
    validating: false,
    pendingChanges: false,
    errors: {},
    data: null
  }),
  [DROPZONE_FORM_LOAD]: (state, action) => ({
    validating: false,
    pendingChanges: false,
    errors: {},
    data: action.dropzone
  }),
  [DROPZONE_FORM_VALIDATE]: (state, action) => ({
    validating: true,
    pendingChanges: state.pendingChanges,
    errors: validate(state.data),
    data: state.data
  }),
  [DROPZONE_PARAMETERS_UPDATE]: (state, action) => {
    const parameters = Object.assign({}, state.data.parameters, {[action.property]: action.value})
    const newData = Object.assign({}, state.data, {parameters: parameters})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  },
  [DROPZONE_DISPLAY_UPDATE]: (state, action) => {
    const display = Object.assign({}, state.data.display, {[action.property]: action.value})
    const newData = Object.assign({}, state.data, {display: display})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  },
  [DROPZONE_NOTIFICATIONS_UPDATE]: (state, action) => {
    const notifications = Object.assign({}, state.data.notifications, {enabled: action.value})
    const newData = Object.assign({}, state.data, {notifications: notifications})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  },
  [DROPZONE_CRITERION_ADD]: (state, action) => {
    const criteria = cloneDeep(state.data.criteria)
    criteria.push({
      id: generateId(),
      instruction: null,
      dropzone: action.dropzoneId
    })
    const newData = Object.assign({}, state.data, {criteria: criteria})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  },
  [DROPZONE_CRITERION_UPDATE]: (state, action) => {
    const criteria = cloneDeep(state.data.criteria)
    const index = criteria.findIndex(c => c.id === action.id)
    const criterion = Object.assign({}, criteria[index], {[action.property]: action.value})
    criteria[index] = criterion
    const newData = Object.assign({}, state.data, {criteria: criteria})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  },
  [DROPZONE_CRITERION_REMOVE]: (state, action) => {
    const criteria = cloneDeep(state.data.criteria)
    const index = criteria.findIndex(c => c.id === action.id)

    if (index > -1) {
      criteria.splice(index, 1)
    }
    const newData = Object.assign({}, state.data, {criteria: criteria})

    return {
      validating: false,
      pendingChanges: true,
      errors: {},
      data: newData
    }
  }
})

export {
  reducer
}
