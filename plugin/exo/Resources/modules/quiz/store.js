/* global process, require */

import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as baseCreate
} from 'redux'
import thunk from 'redux-thunk'

import {reducers as quizReducers} from './reducers'
import {reducers as editorReducers} from './editor/reducers'
import {reducers as playerReducers} from './player/reducers'
import {VIEW_PLAYER, VIEW_EDITOR} from './enums'
import {VIEW_MODE_UPDATE} from './actions'

const reducerForEditorMode = {
  quiz: editorReducers.quiz,
  steps: editorReducers.steps,
  items: editorReducers.items,
  currentObject: editorReducers.currentObject,
  openPanels: editorReducers.openPanels,
  modal: editorReducers.modal,
  viewMode: quizReducers.viewMode
}

const reducerForPlayerMode = {
  quiz: editorReducers.quiz,
  steps: editorReducers.steps,
  items: playerReducers.items,
  currentObject: editorReducers.currentObject,
  openPanels: editorReducers.openPanels,
  modal: editorReducers.modal,
  viewMode: quizReducers.viewMode
}

let finalStore

const reducerSwitcher = () => next => action => {
  let reducer
  if(action.type === VIEW_MODE_UPDATE){
    switch(action.mode){
      case VIEW_PLAYER:
        reducer = combineReducers(reducerForPlayerMode)
        break
      case VIEW_EDITOR:
        reducer = combineReducers(reducerForEditorMode)
        break
    }
  }
  finalStore.replaceReducer(reducer)
  let result = next(action)
  return result
}

const middleware = [thunk, reducerSwitcher]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

export function createStore(initialState) {
  finalStore =  baseCreate(combineReducers(reducerForEditorMode), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
  return finalStore
}
