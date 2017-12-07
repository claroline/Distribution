import {makeActionCreator} from '#/main/core/utilities/redux'

export const IMPORT_SWITCH_TAB = 'IMPORT_SWITCH_TAB'
export const actions = {}

actions.switchTab = makeActionCreator(IMPORT_SWITCH_TAB, 'tab')
