import cloneDeep from 'lodash/cloneDeep'

import {actions as formActions} from '#/main/core/data/form/actions'

import {select} from '#/main/core/tools/home/editor/selectors'

export const actions = {}

actions.addWidget = (position, widget) => (dispatch, getState) => {
  // get the widgets list to modify
  const widgets = cloneDeep(select.widgets(getState()))

  // insert new element
  widgets.splice(position, 0, widget)

  // update form data
  return dispatch(formActions.updateProp('editor', 'widgets', widgets))
}

actions.updateWidget = (position, widget) => formActions.updateProp('editor', `widgets[${position}]`, widget)

actions.deleteWidget = (position) => (dispatch, getState) => {
  // get the widgets list to modify
  const widgets = cloneDeep(select.widgets(getState()))

  // remove element
  widgets.splice(position, 1)

  // update form data
  return dispatch(formActions.updateProp('editor', 'widgets', widgets))
}
