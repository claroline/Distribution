import invariant from 'invariant'

import { generateUrl } from './../utils/routing'
import { actions as apiActions } from './actions'
import { actions as alertActions } from './../alert/actions'

const baseRequest = {
  method: 'GET',
  credentials: 'include'
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
    const contentType = response.headers.get('content-type');
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
    const url = getUrl(target)
    const finalRequest = Object.create({}, baseRequest, request)

    this.dispatch(apiActions.sendRequest)

    return fetch(url, finalRequest)
      .then(response => {
        this.dispatch(apiActions.receiveResponse)
        if (response.ok) {
          if (204 !== response.status) {
            return getResponseData(response)
          } else {
            return null
          }
        } else {
          switch(response.status) {
            // User needs to log in
            case 401:
              this.dispatch(alertActions.addAlert('warning', 'You need to be logged.'))
              break

            // User is not authorized
            case 403:
              this.dispatch(alertActions.addAlert('error', 'You are not authorized to do this.'))
              break

            // Validation error
            case 422:
              this.dispatch(alertActions.addAlert('error', 'Invalid data sent.'))
              break

            // All other errors
            default:
              this.dispatch(alertActions.addAlert('error', 'Server error.'))
              break
          }
        }

        return response.json()
      })
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
