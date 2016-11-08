/* global process, require */

import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as baseCreate
} from 'redux'
import thunk from 'redux-thunk'
import {reducers} from './reducers'

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
  modal: reducers.modal
})

export function createStore(initialState) {
  return baseCreate(reducer, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}
