import {makeActionCreator} from './../../utils/actions'

export const SEARCH_ADD_FILTER    = 'SEARCH_ADD_FILTER'
export const SEARCH_REMOVE_FILTER = 'SEARCH_REMOVE_FILTER'
export const SEARCH_CLEAR         = 'SEARCH_CLEAR'

export const actions = {}

actions.addSearchFilter = makeActionCreator(SEARCH_ADD_FILTER, 'property', 'value')
actions.removeSearchFilter = makeActionCreator(SEARCH_REMOVE_FILTER, 'property')
actions.clearSearch = makeActionCreator(SEARCH_CLEAR)