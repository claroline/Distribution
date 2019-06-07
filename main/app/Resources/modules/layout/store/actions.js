import {makeActionCreator} from '#/main/app/store/actions'

// actions
export const MENU_TOGGLE = 'MENU_TOGGLE'
export const MENU_CHANGE_SECTION = 'MENU_CHANGE_SECTION'

export const SIDEBAR_OPEN  = 'SIDEBAR_OPEN'
export const SIDEBAR_CLOSE = 'SIDEBAR_CLOSE'

// action creators
export const actions = {}

// Menu
actions.toggleMenu = makeActionCreator(MENU_TOGGLE)
actions.changeMenuSection = makeActionCreator(MENU_CHANGE_SECTION, 'section')

// Toolbar & Sidebar
actions.openSidebar = makeActionCreator(SIDEBAR_OPEN, 'toolName')
actions.closeSidebar = makeActionCreator(SIDEBAR_CLOSE)
