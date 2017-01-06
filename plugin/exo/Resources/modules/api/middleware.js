import invariant from 'invariant'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'

import { update } from './../utils/utils'
import { generateUrl } from './../utils/routing'
import { actions as alertActions } from './../alert/actions'
import {
  REQUEST_SEND,
  actions as apiActions
} from './actions'

const defaultRequest = {
  method: 'GET',
  credentials: 'include'
}

function handleResponse(dispatch, response) {
  dispatch(apiActions.decrementRequests())
  dispatch(apiActions.receiveResponse(response))

  if (!response.ok) {
    return Promise.reject(response)
  }

  return response
}

function handleResponseSuccess(data, success) {
  if (success) {
    invariant(isFunction(success), '`success` should be a function')
  }

  return dispatch => {
    if (success) {
      return dispatch(success(data))
    }
  }
}

function handleResponseError(error, failure) {
  if (failure) {
    invariant(isFunction(failure), '`failure` should be a function')
  }

  return dispatch => {
    switch (error.status) {
      // User needs to log in
      case 401:
        dispatch(alertActions.addAlert('warning', 'You need to be logged.'))
        break

      // User is not authorized
      case 403:
        dispatch(alertActions.addAlert('error', 'You are not authorized to do this.'))
        break

      // Validation error
      case 422:
        dispatch(alertActions.addAlert('error', 'Invalid data sent.'))
        break

      // All other errors
      default:
        dispatch(alertActions.addAlert('error', error.statusText))
        break
    }

    if (failure) {
      return dispatch(failure(error))
    }
  }
}

/**
 * Extracts data from response object.
 *
 * @param {Response} response
 *
 * @returns {mixed}
 */
function getResponseData(response) {
  let data = null

  if (response.body) {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') !== -1) {
      // Decode JSON
      data = response.json()
    } else {
      // Return raw data (maybe someday we will need to also manage files)
      data = response.text()
    }
  }

  return data // this is a promise
}

function getUrl(url, route) {
  invariant(url || route, 'a `url` or a `route` property is required')

  if (url) {
    invariant(isString(url), '`url` should be a string')

    return url
  } else {
    invariant(Array.isArray(route), '`route` should be an array')

    return generateUrl(route[0], route[1] ? route[1] : {})
  }
}

function handleBefore(before) {
  if (before) {
    invariant(!isFunction(before), '`before` should be a function')
  }

  return dispatch => {
    dispatch(apiActions.incrementRequests())
    if (before === 'function') {
      dispatch(before())
    }
  }
}

function getRequest(request = {}) {
  invariant(request instanceof Object, '`request` should be an object')

  // Add default values to request
  return update(defaultRequest, {
    $merge: request
  })
}

const apiMiddleware = () => next => action => {
  const sendRequest = action[REQUEST_SEND]
  if (typeof sendRequest === 'undefined') {
    return next(action)
  }

  const { url, route, request, before, success, failure } = sendRequest

  const finalUrl = getUrl(url, route)
  const finalRequest = getRequest(request)

  next(handleBefore(before))

  return fetch(finalUrl, finalRequest)
    .then(response => handleResponse(next, response))
    .then(response => getResponseData(response))
    .then(
      data  => next(handleResponseSuccess(data, success)),
      error => next(handleResponseError(error, failure))
    )
}

export {apiMiddleware}
