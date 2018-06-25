import {actions as formActions} from '#/main/core/data/form/actions'

import {selectors} from '#/main/core/widget/modals/parameters/store'

// action names


// action creators
export const actions = {}

/**
 * Updates the widget configuration.
 */
actions.save = () => formActions.saveForm(selectors.FORM_NAME, ['claro_resource_action', {

}])
