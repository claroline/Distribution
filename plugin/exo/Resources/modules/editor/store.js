/* global process, require */

import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as baseCreate
} from 'redux'
import thunk from 'redux-thunk'
import {reducer as formReducer} from 'redux-form'
import {reducers} from './reducers'
import {TYPE_QUIZ, mimeTypes} from './types'

const middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

const reducer = combineReducers({
  quiz: reducers.quiz,
  steps: reducers.steps,
  items: reducers.items,
  currentObject: reducers.currentObject,
  openPanels: reducers.openPanels,
  modal: reducers.modal,
  categories: () => ['C1', 'C2'], // FIXME
  itemTypes: () => mimeTypes,
  form: formReducer
})

export function createStore(rawQuiz) {
  const initialState = normalizeState(rawQuiz)
  return baseCreate(reducer, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}

function normalizeState(rawQuiz) {
  const items = {}
  const steps = {}
  rawQuiz.steps.forEach(step => {
    step._errors = {parameters: {}}
    step.items = step.items.map(item => {
      items[item.id] = item
      item._errors = {}
      return item.id
    })
    steps[step.id] = step
  })
  return {
    quiz: {
      id: rawQuiz.id,
      title: rawQuiz.title,
      description: rawQuiz.description,
      parameters: rawQuiz.parameters,
      steps: rawQuiz.steps.map(step => step.id),
      _errors: {parameters: {}}
    },
    steps,
    items,
    currentObject: {
      id: rawQuiz.id,
      type: TYPE_QUIZ
    }
  }
}
