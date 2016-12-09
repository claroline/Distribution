/* global process, require */

import {
  applyMiddleware,
  compose,
  createStore as baseCreate
} from 'redux'
import thunk from 'redux-thunk'
import bankApp from './reducers/index'
import {listItemMimeTypes} from './../items/item-types'

const middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
}

bankApp.itemTypes = () => listItemMimeTypes()

export function createStore(initialState) {
  return baseCreate(
    bankApp,
    initialState,
    compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
