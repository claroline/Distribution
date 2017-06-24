import {makeActionCreator} from '#/main/core/utilities/redux'


export const THEME_ADD = 'THEME_ADD'
export const THEME_DELETE = 'THEME_DELETE'

export const actions = {}

actions.addTheme = makeActionCreator(THEME_ADD, 'theme')
actions.removeTheme = makeActionCreator(THEME_DELETE, 'theme')
