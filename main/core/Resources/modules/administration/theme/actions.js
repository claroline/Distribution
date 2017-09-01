import {makeActionCreator} from '#/main/core/utilities/redux'

export const THEMES_REMOVE  = 'THEMES_REMOVE'
export const THEMES_REBUILD = 'THEMES_REBUILD'
export const THEME_UPDATE   = 'THEME_UPDATE'

export const actions = {}

actions.removeThemes = makeActionCreator(THEMES_REMOVE, 'themes')
actions.rebuildThemes = makeActionCreator(THEMES_REBUILD, 'themes')
actions.saveTheme = makeActionCreator(THEME_UPDATE, 'theme')
