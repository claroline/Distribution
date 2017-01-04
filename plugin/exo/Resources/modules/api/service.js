import invariant from 'invariant'

import { generateUrl } from './../utils/routing'
import { actions as apiActions } from './actions'
import { actions as alertActions } from './../alert/actions'

const defaultRequest = {
  method: 'GET',
  credentials: 'include'
}

class ApiError extends Error {
  constructor(msg, status, detail = null) {
    super(msg)
    console.log('I am an api error')

    this.status = status
    this.detail = detail
  }
}

/**
 * Get the URL of an api target.
 *
 * Target can be :
 *  - an URL string
 *  - a route array : 1st key contains the route name, the 2nd the params
 *
 * @param target
 *
 * @returns {string}
 */
function getUrl(target) {
  if (typeof target === 'string' || target instanceof String) {
    return target
  } else if (Array.isArray(target)) {
    return generateUrl(target[0], target[1] ? target[1] : null)
  } else {
    invariant(target, 'API `target` must be either an URL string or an array defining the route config.')
  }
}

function handleRequest(dispatch, target, request) {
  const url = getUrl(target)
  const finalRequest = Object.create({}, defaultRequest, request)

  dispatch(apiActions.sendRequest)

  return fetch(url, finalRequest)
    .then(response => handleResponse(dispatch, response))
    .then(response => handleResponseSuccess(response, this.dispatch))
    .catch(error => handleResponseError(dispatch, error))
}

function handleResponse(dispatch, response) {
  dispatch(apiActions.receiveResponse)

  if (!response.ok) {
    throw ApiError(response.statusText, response.status)
  }

  return response
}

function handleResponseSuccess(dispatch, response) {
  if (204 !== response.status) {
    return getResponseData(response)
  } else {
    // Empty response
    return null
  }
}

function handleResponseError(dispatch, error) {
  dispatch(alertActions.addAlert('error', error.message))
  /*switch(response.status) {
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
      dispatch(alertActions.addAlert('error', 'Server error.'))
      break
  }*/
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

  return data
}

export class Api {
  constructor(dispatch) {
    this.dispatch = dispatch
  }

  request(target, request) {
    return handleRequest(this.dispatch, target, request)
  }

  get(target, request = {}) {
    request.method = 'GET'

    return this.request(target, request)
  }

  post(target, request = {}) {
    request.method = 'POST'

    return this.request(target, request)
  }

  put(target, request = {}) {
    request.method = 'PUT'

    return this.request(target, request)
  }

  delete(target, request = {}) {
    request.method = 'DELETE'

    return this.request(target, request)
  }
}
