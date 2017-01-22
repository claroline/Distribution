import invariant from 'invariant'
import {makeActionCreator} from './../../utils/utils'

export const SELECT_MODE = 'SELECT_MODE'
export const SELECT_IMAGE = 'SELECT_IMAGE'
export const CREATE_AREA = 'CREATE_AREA'

export const actions = {}

actions.selectMode = makeActionCreator(SELECT_MODE, 'mode')
actions.selectImage = makeActionCreator(SELECT_IMAGE, 'image')
actions.createArea = makeActionCreator(CREATE_AREA, 'x', 'y')
