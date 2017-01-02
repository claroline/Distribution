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
import {reducePapers} from './papers/reducer'
import {QUIZ_SAVE} from './editor/actions'
import {generateUrl} from './../utils/routing'
import {denormalize} from './normalizer'

const quizSave = store => next => action => {
  if (action.type === QUIZ_SAVE) {
    const state = store.getState()
    const denormalized = denormalize(state.quiz, state.steps, state.items)
    const url = generateUrl('exercise_update', {id: state.quiz.id})
    const params = {
      method: 'PUT' ,
      credentials: 'include',
      body: JSON.stringify(denormalized)
    }
    fetch(url, params)
     .then(response => {
       if(!response.ok){
         // do something with errors...
       }
       return next(action)
     })
  } else {
    return next(action)
  }
}

const middleware = [thunk, quizSave]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

const returnSelf = (state = null) => state

export function makeReducer(editable) {
  return combineReducers({
    noServer: returnSelf,
    viewMode: quizReducers.viewMode,
    quiz: editable ? editorReducers.quiz : returnSelf,
    steps: editable ? editorReducers.steps : returnSelf,
    items: editable ? editorReducers.items : returnSelf,
    modal: editable ? editorReducers.modal : returnSelf,
    editor: editable ? editorReducers.editor : returnSelf,
    testMode: playerReducers.testMode,
    currentStep: playerReducers.currentStep,
    paper: playerReducers.paper,
    answers: playerReducers.answers,
    papers: reducePapers
  })
}

export function createStore(initialState, editable = true) {
  return baseCreate(makeReducer(editable), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}
