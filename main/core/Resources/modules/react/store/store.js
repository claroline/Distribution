/* global process, require */

import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as baseCreate
} from 'redux'

import {reducers as apiReducers} from './reducer'

import thunk from 'redux-thunk'
import {apiMiddleware} from './middleware'

const middleware = [apiMiddleware, thunk]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

const identity = (state = null) => state

export function makeReducer(reducers = {}) {
  const initialValue =  {noServer: identity, currentRequests: apiReducers.currentRequests}
  const combined = Object.assign(initialValue, reducers)

  return combineReducers(combined)
}

export function createStore(initialState, reducers = {}) {
  return baseCreate(makeReducer(reducers), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}
