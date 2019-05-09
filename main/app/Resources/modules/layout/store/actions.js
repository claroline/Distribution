import {makeActionCreator} from '#/main/app/store/actions'

// actions
export const MENU_TOGGLE = 'MENU_TOGGLE'

// action creators
export const actions = {}

actions.toggleMenu = makeActionCreator(MENU_TOGGLE)
