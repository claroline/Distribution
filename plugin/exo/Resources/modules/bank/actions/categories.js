import {makeActionCreator} from './../../utils/actions'

export const CATEGORY_UPDATE = 'CATEGORY_UPDATE'

export const actions = {}

actions.updateCategory = makeActionCreator(CATEGORY_UPDATE, 'category')