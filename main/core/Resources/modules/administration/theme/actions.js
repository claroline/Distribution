import {makeActionCreator} from '#/main/core/utilities/redux'

export const THEME_ADD      = 'THEME_ADD'
export const THEME_COPY     = 'THEME_COPY'
export const THEMES_REMOVE  = 'THEMES_REMOVE'
export const THEMES_REBUILD = 'THEMES_REBUILD'

export const actions = {}

actions.createTheme = makeActionCreator(THEME_ADD)
actions.copyTheme = makeActionCreator(THEME_COPY, 'theme')
actions.removeThemes = makeActionCreator(THEMES_REMOVE, 'themes')
actions.rebuildThemes = makeActionCreator(THEMES_REBUILD, 'themes')
