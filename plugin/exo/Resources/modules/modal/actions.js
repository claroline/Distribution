import {makeActionCreator} from './../utils/actions'

export const MODAL_FADE = 'MODAL_FADE'
export const MODAL_HIDE = 'MODAL_HIDE'
export const MODAL_SHOW = 'MODAL_SHOW'

export const actions = {}

actions.fadeModal = makeActionCreator(MODAL_FADE)
actions.hideModal = makeActionCreator(MODAL_HIDE)
actions.showModal = makeActionCreator(MODAL_SHOW, 'modalType', 'modalProps')