import {makeReducer} from './../utils/reducers'

import {
  MODAL_FADE,
  MODAL_HIDE,
  MODAL_SHOW
} from './actions'

const initialModalState = {
  type: null,
  props: {},
  fading: false
}

function fadeModal(modalState) {
  return update(modalState, {fading: {$set: true}})
}

function hideModal() {
  return initialModalState
}

function showModal(modalState, action = {}) {
  return {
    type: action.modalType,
    props: action.modalProps,
    fading: false
  }
}

const modalReducer = makeReducer(initialModalState, {
  [MODAL_FADE]: fadeModal,
  [MODAL_HIDE]: hideModal,
  [MODAL_SHOW]: showModal
})

export default modalReducer
