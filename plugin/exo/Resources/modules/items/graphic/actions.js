import invariant from 'invariant'
import {makeActionCreator} from './../../utils/utils'

export const SELECT_MODE = 'SELECT_MODE'
export const SELECT_IMAGE = 'SELECT_IMAGE'
export const RESIZE_IMAGE = 'RESIZE_IMAGE'
export const CREATE_AREA = 'CREATE_AREA'
export const SELECT_AREA = 'SELECT_AREA'
export const MOVE_AREA = 'MOVE_AREA'
export const DELETE_AREA = 'DELETE_AREA'

export const actions = {}

actions.selectMode = makeActionCreator(SELECT_MODE, 'mode')
actions.selectImage = makeActionCreator(SELECT_IMAGE, 'image')
actions.resizeImage = makeActionCreator(RESIZE_IMAGE, 'width', 'height')
actions.createArea = makeActionCreator(CREATE_AREA, 'x', 'y')
actions.selectArea = makeActionCreator(SELECT_AREA, 'id')
actions.moveArea = makeActionCreator(MOVE_AREA, 'id', 'x', 'y')
actions.deleteArea = makeActionCreator(DELETE_AREA, 'id')
