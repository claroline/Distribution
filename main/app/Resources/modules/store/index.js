/* global process, require, window */

import {
  applyMiddleware,
  compose,
  createStore as baseCreate
} from 'redux'
import thunk from 'redux-thunk'
import merge from 'lodash/merge'

import {combineReducers} from '#/main/app/store/reducer'

import {apiMiddleware} from '#/main/app/api/store/middleware'

// pre-configure store for all redux apps
const middleware = [apiMiddleware, thunk]

// add dev tools
if (process.env.NODE_ENV !== 'production') { // todo : retrieve current env elsewhere
  // Register redux freeze (it will throw errors if the state is mistakenly mutated)
  middleware.push(
    require('redux-freeze')
  )
}

/**
 * Generates a new pre-configured application store.
 *
 * @param {object} reducers        - an object containing a list of reducers to mount in the store.
 * @param {object} initialState    - the data to preload in the store at creation.
 * @param {Array}  customEnhancers - [Advanced use] a list of custom store enhancers.
 *
 * @return {*}
 */
function createStore(reducers, initialState = {}, customEnhancers = []) {
  // preserve initial state for not-yet-loaded reducers
  const createReducer = (reducers) => {
    const reducerNames = Object.keys(reducers)
    Object.keys(initialState).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        reducers[item] = (state = null) => state
      }
    })
    return combineReducers(reducers)
  }

  // register browser extension
  // we must do it at each store creation in order to register all
  // of them in the dev console
  const enhancers = []
  if (window.devToolsExtension) {
    enhancers.push(window.devToolsExtension())
  }

  const store = baseCreate(
    createReducer(reducers),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers.concat(customEnhancers)
    )
  )

  // support for dynamic reducer loading
  store.asyncReducers = {};
  store.injectReducer = (key, reducer) => {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(
      createReducer(merge({}, reducers, store.asyncReducers))
    );

    return store;
  }

  return store
}

export {
  createStore
}
