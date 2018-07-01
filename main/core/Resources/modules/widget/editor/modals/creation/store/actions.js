import merge from 'lodash/merge'

import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'
import {makeId} from '#/main/core/scaffolding/id'

import {actions as formActions} from '#/main/core/data/form/actions'

import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'
import {selectors} from '#/main/core/widget/editor/modals/creation/store'

// action names
export const WIDGET_TYPES_LOAD = 'WIDGET_TYPES_LOAD'

// action creators
export const actions = {}

actions.loadWidgets = makeActionCreator(WIDGET_TYPES_LOAD, 'types')

actions.fetchWidgets = (context) => ({
  [API_REQUEST]: {
    url: ['apiv2_widget_available', {context: context}],
    success: (response, dispatch) => dispatch(actions.loadWidgets(response))
  }
})

actions.startCreation = (widgetLayout) => (dispatch) => {
  // initialize the form with default values
  dispatch(formActions.resetForm(selectors.FORM_NAME, merge({}, WidgetContainerTypes.defaultProps, {
    id: makeId()
  }), true))

  // set the widget layout
  // (I do it in 2 steps to let the form toggle the pending changes flag)
  dispatch(formActions.updateProp(selectors.FORM_NAME, 'display.layout', widgetLayout))
}
