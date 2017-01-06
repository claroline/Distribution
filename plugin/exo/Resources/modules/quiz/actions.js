import {makeActionCreator} from './../utils/utils'

export const VIEW_MODE_UPDATE = 'VIEW_MODE_UPDATE'

const updateViewMode = makeActionCreator(VIEW_MODE_UPDATE, 'mode')

export const actions = {
  updateViewMode
}
