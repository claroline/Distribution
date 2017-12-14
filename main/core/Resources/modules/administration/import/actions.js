import {makeActionCreator} from '#/main/core/utilities/redux'

export const actions = {}

export const UPDATE_IMPORT_DATA = 'UPDATE_IMPORT_DATA'

//actions.update = makeActionCreator(UPDATE_IMPORT_DATA, 'property', 'value', 'form', 'entity')

actions.updateProp = (property, value, form, entity) => (dispatch) => {
  console.log('update something')
  if (property === 'action') {
     window.location.hash = '#import/' + entity + '/' + value
  }

  dispatch({
    [UPDATE_IMPORT_DATA]: {property, value, form, entity}
  })
}
