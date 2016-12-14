
import {makeActionCreator} from './../utils/utils'

export const VIEW_MODE_UPDATE = 'VIEW_MODE_UPDATE'

export const actions = {}

actions.updateViewMode = makeActionCreator(VIEW_MODE_UPDATE, 'mode')
