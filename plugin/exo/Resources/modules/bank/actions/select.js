import {makeActionCreator} from './../../utils/actions'

export const ITEMS_SELECT = 'ITEMS_SELECT'
export const ITEM_SELECT = 'ITEM_SELECT'
export const ITEM_DESELECT = 'ITEM_DESELECT'
export const ITEM_DESELECT_ALL = 'ITEM_DESELECT_ALL'

export const actions = {}

actions.select = makeActionCreator(ITEMS_SELECT, 'items')
actions.selectItem = makeActionCreator(ITEM_SELECT, 'itemId')
actions.deselectItem = makeActionCreator(ITEM_DESELECT, 'itemId')
actions.deselectAll = makeActionCreator(ITEM_DESELECT_ALL)
