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
import {VIEW_OVERVIEW, VIEW_PLAYER, VIEW_EDITOR} from './enums'
import {VIEW_MODE_UPDATE} from './actions'

const reducerForEditorMode = combineReducers({
  quiz: editorReducers.quiz,
  steps: editorReducers.steps,
  items: editorReducers.items,
  currentObject: editorReducers.currentObject,
  openPanels: editorReducers.openPanels,
  modal: editorReducers.modal,
  viewMode: quizReducers.viewMode
})

const reducerForPlayerMode = combineReducers({
  quiz: editorReducers.quiz,
  steps: editorReducers.steps,
  items: playerReducers.items,
  currentObject: editorReducers.currentObject,
  openPanels: editorReducers.openPanels,
  modal: editorReducers.modal,
  viewMode: quizReducers.viewMode
})

let finalStore

const reducerSwitcher = () => next => action => {
  if (action.type === VIEW_MODE_UPDATE) {
    let reducer
    switch(action.mode){
      case VIEW_OVERVIEW:
      case VIEW_PLAYER:
        reducer = reducerForPlayerMode
        break
      case VIEW_EDITOR:
        reducer = reducerForEditorMode
        break
    }
    finalStore.replaceReducer(reducer)
  }

  return next(action)
}

const middleware = [thunk, reducerSwitcher]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

export function createStore(initialState) {
  finalStore = baseCreate(reducerForEditorMode, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
  return finalStore
}
