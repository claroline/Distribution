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
import {QUIZ_SAVE} from './editor/actions'
import {generateUrl} from './../utils/routing'
import {denormalize} from './normalizer'

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
      case VIEW_PLAYER:
        reducer = reducerForPlayerMode
        break
      case VIEW_EDITOR:
        reducer = reducerForEditorMode
        break
    }
    finalStore.replaceReducer(reducer)
  }

  let result = next(action)
  return result
}

const quizSave = store => next => action => {
  if (action.type === QUIZ_SAVE) {
    const state = store.getState()
    console.log('middleware save quiz')
    //console.log(state)
    const denormalized = denormalize(state.quiz, state.steps, state.items)
    console.log(JSON.stringify(denormalized))
    const url = generateUrl('exercise_update', {'id': state.quiz.id})
    const params = {
      method: 'PUT' ,
      credentials: 'include',
      body: JSON.stringify(denormalized)
    }
    fetch(url, params)
     .then(response => {
       return response.json()
       // do something if errors but how to handle errors in middleware ?
     })
     .then(jsonData =>  {
       // do we need any data from saved exercise ?
       console.log(jsonData)
     })
  }
  let result = next(action)
  return result
}

const middleware = [thunk, reducerSwitcher, quizSave]

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
