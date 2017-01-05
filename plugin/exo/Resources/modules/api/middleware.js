import invariant from 'invariant'

import { update } from './../utils/utils'
import { generateUrl } from './../utils/routing'
import { actions as alertActions } from './../alert/actions'
import { actions as apiActions } from './actions'
import {
  REQUEST_SEND,
  actions
} from './actions'

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

function handleResponse(dispatch, response) {
  console.log('handle raw response')

  dispatch(actions.decrementRequests())

  if (!response.ok) {
    return Promise.reject(response)
  }

  return response
}

function handleResponseSuccess(response) {
  console.log('handle success')

  return dispatch => {
    const data = (204 !== response.status) ? getResponseData(response) : null
    
    dispatch(apiActions.receiveSuccessResponse(data))
  }
}

function handleResponseError(error) {
  console.log('handle errors')

  return dispatch => {
    dispatch(alertActions.addAlert('error', error.statusText))
    dispatch(apiActions.receiveFailureResponse(error))
  }

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

const apiMiddleware = store => next => action => {
  // Catch api actions
  if (REQUEST_SEND === action.type) {
    console.log('yeah i can catch things !!!!')

    next(actions.incrementRequests())

    const url = getUrl(action.target)
    const finalRequest = update(defaultRequest, {
      $merge: action.request
    })

    return fetch(url, finalRequest)
      .then(response => handleResponse(next, response))
      .then(
        response => next(handleResponseSuccess(response)),
        error    => next(handleResponseError(error))
      )
  }

  return next(action)
}

export {apiMiddleware}
