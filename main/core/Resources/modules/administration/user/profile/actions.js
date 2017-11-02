import {makeActionCreator} from '#/main/core/utilities/redux'

export const PROFILE_ADD_TAB = 'PROFILE_ADD_TAB'
export const PROFILE_UPDATE_TAB = 'PROFILE_UPDATE_TAB'
export const PROFILE_REMOVE_TAB = 'PROFILE_REMOVE_TAB'

export const PROFILE_ADD_SECTION = 'PROFILE_ADD_SECTION'
export const PROFILE_UPDATE_SECTION = 'PROFILE_UPDATE_SECTION'
export const PROFILE_REMOVE_SECTION = 'PROFILE_REMOVE_SECTION'

export const actions = {}

actions.addTab = makeActionCreator(PROFILE_ADD_TAB)
actions.updateTab = makeActionCreator(PROFILE_UPDATE_TAB, 'tabId', 'prop', 'value')
actions.removeTab = makeActionCreator(PROFILE_REMOVE_TAB, 'tabId')

actions.addSection = makeActionCreator(PROFILE_ADD_SECTION, 'tabId')
actions.updateSection = makeActionCreator(PROFILE_UPDATE_SECTION, 'sectionId', 'prop', 'value')
actions.removeSection = makeActionCreator(PROFILE_REMOVE_SECTION, 'sectionId')
