import {makeActionCreator} from './../../utils/actions'



export const actions = {}

actions.toggleSelect = makeActionCreator(SELECT_TOGGLE, 'itemId')
