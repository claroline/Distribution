import {makeActionCreator} from '#/main/core/utilities/redux'

export const LIST_FILTER_ADD = 'LIST_FILTER_ADD'
export const LIST_FILTER_REMOVE = 'LIST_FILTER_REMOVE'
export const LIST_SORT_UPDATE = 'LIST_SORT_UPDATE'

export const actions = {}

actions.addFilter = makeActionCreator(LIST_FILTER_ADD, 'property', 'value')
actions.removeFilter = makeActionCreator(LIST_FILTER_REMOVE, 'filter')

actions.updateSort = makeActionCreator(LIST_SORT_UPDATE, 'property')
