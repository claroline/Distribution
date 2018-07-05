import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const CURRENT_TAB = 'CURRENT_TAB'
export const TAB_EDIT = 'TAB_EDIT'
export const TAB_STOP_EDIT = 'TAB_STOP_EDIT'
export const actions = {}

actions.setCurrentTab = makeActionCreator(CURRENT_TAB, 'tab')
actions.isEditing = makeActionCreator(TAB_EDIT)
actions.stopEditing = makeActionCreator(TAB_STOP_EDIT)
