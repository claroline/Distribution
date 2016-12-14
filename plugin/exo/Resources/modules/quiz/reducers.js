//import {combineReducers} from 'redux'
import {VIEW_PLAYER, VIEW_EDITOR} from './enums'
import {VIEW_MODE_UPDATE} from './actions'
//import {reducers as editorReducers} from './editor/reducers'
//import {reducers as playerReducers} from './player/reducers'


function initialViewMode() {
  return VIEW_EDITOR
}

function reduceViewMode(viewMode = initialViewMode(), action = {}) {
  switch (action.type) {
    case VIEW_MODE_UPDATE: {
      //@TODO should switch the appropriates reducers
      /*if(action.mode === VIEW_PLAYER){

      } else {

      }*/
      return action.mode
    }
  }
  return viewMode
}
/*
export const reducer = combineReducers({
  quiz: editorReducers.quiz,
  steps: editorReducers.steps,
  items: editorReducers.items,
  currentObject: editorReducers.currentObject,
  openPanels: editorReducers.openPanels,
  modal: editorReducers.modal,
  viewMode: reduceViewMode
})
*/
export const reducers = {
  viewMode: reduceViewMode
}
