import invariant from 'invariant'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import {authenticate} from '#/main/core/authentication'
import {tex} from './../utils/translate'
import {generateUrl} from './../utils/routing'
import {showModal} from './../modal/actions'
import {MODAL_MESSAGE} from './../modal'
import {REQUEST_SEND, actions} from './actions'

const defaultRequest = {
  method: 'GET',
  credentials: 'include'
}

function handleResponse(dispatch, response) {
  dispatch(actions.decrementRequests())
  dispatch(actions.receiveResponse(response))

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

function handleResponseError(error, failure, request, next) {
  if (failure) {
    invariant(isFunction(failure), '`failure` should be a function')
  }

  const doFail = dispatch => {
    if (failure) {
      dispatch(failure(error))
    }

    showErrorModal(dispatch, error.status)
  }

  if (error.status === 401) {
    return dispatch => {
      authenticate().then(
        () => doFetch(request, next), // re-execute original request,
        () => doFail(dispatch) // user dismissed re-auth window, show 401
      )
    }
  }

  return doFail(dispatch)
}

function showErrorModal(dispatch, status) {
  dispatch(showModal(MODAL_MESSAGE, {
    title: tex('request_error'),
    bsStyle: 'danger',
    message: [401, 403, 422].indexOf(status) > -1 ?
      tex(`request_error_desc_${status}`) :
      tex('request_error_desc_default')
  }))
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

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.indexOf('application/json') !== -1) {
    // Decode JSON
    data = response.json()
  } else {
    // Return raw data (maybe someday we will need to also manage files)
    data = response.text()
  }

  return data // this is a promise
}

function getUrl(url, route) {
  invariant(url || route, 'a `url` or a `route` property is required')

  if (url) {
    invariant(isString(url), '`url` should be a string')

    return url
  }

  invariant(Array.isArray(route), '`route` should be an array')

  return generateUrl(route[0], route[1] ? route[1] : {})
}

function handleBefore(before) {
  return dispatch => {
    if (before) {
      invariant(isFunction(before), '`before` should be a function')
      dispatch(before())
    }

    dispatch(actions.incrementRequests())
  }
}

function getRequest(request = {}) {
  invariant(request instanceof Object, '`request` should be an object')

  // Add default values to request
  return Object.assign({}, defaultRequest, request)
}

function doFetch(requestParameters, next) {
  const {url, route, request, before, success, failure} = requestParameters
  const finalUrl = getUrl(url, route)
  const finalRequest = getRequest(request)

  next(handleBefore(before))

  return fetch(finalUrl, finalRequest)
    .then(response => handleResponse(next, response))
    .then(response => getResponseData(response))
    .then(
      data => next(handleResponseSuccess(data, success)),
      error => next(handleResponseError(error, failure, requestParameters, next))
    )
}

const apiMiddleware = () => next => action => {
  const requestParameters = action[REQUEST_SEND]

  if (typeof requestParameters === 'undefined') {
    return next(action)
  }

  return doFetch(requestParameters, next)
}

export {apiMiddleware}
