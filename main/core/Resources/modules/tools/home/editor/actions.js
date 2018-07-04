import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const CREATE_TAB = 'CREATE_TAB'
export const actions = {}

actions.createTab = makeActionCreator(CREATE_TAB, 'data')
