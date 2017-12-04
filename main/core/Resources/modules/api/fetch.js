import merge from 'lodash/merge'
import {checkPropTypes} from 'prop-types'

import {getUrl} from '#/main/core/fos-js-router'
import {authenticate} from '#/main/core/authentication'
import {makeId} from '#/main/core/utilities/id'

import {API_REQUEST, actions} from '#/main/core/api/actions'
import {ApiRequest as ApiRequestTypes} from '#/main/core/api/prop-types'

/**
 * A callback executed before the request is sent.
 *
 * @param {function} dispatch
 * @param {object}   originalRequest
 * @param {function} before
 *
 * @return {mixed}
 */
function handleBefore(dispatch, originalRequest, before) {
  dispatch(actions.sendRequest(originalRequest))

  return before(dispatch)
}

/**
 * A callback executed when a response is received.
 *
 * @param {function} dispatch
 * @param {object}   response
 * @param {object}   originalRequest
 *
 * @return {Promise}
 */
function handleResponse(dispatch, response, originalRequest) {
  dispatch(actions.receiveResponse(originalRequest, response))

  if (!response.ok) {
    return Promise.reject(response)
  }

  return getResponseData(response)
}

/**
 * A callback executed when a success response is received.
 *
 * @param {function} dispatch
 * @param {mixed}    responseData
 * @param {function} success
 *
 * @return {mixed}
 */
function handleResponseSuccess(dispatch, responseData, success) {
  return success(responseData, dispatch)
}

/**
 * A callback executed when an error response is received.
 *
 * @param {function} dispatch
 * @param {object}   responseError
 * @param {object}   originalRequest
 * @param {function} error
 *
 * @return {mixed}
 */
function handleResponseError(dispatch, responseError, originalRequest, error) {
  console.log('handle response error')
  if (typeof responseError.status === 'undefined') {
    // if error isn't related to http response, rethrow it
    throw responseError
  }

  if (responseError.status === 401) { // authentication needed
    authenticate()
      .then(
        () => apiFetch(originalRequest, dispatch), // re-execute original request,
        authError => error(authError, dispatch)
      )
  } else {
    return error(responseError, dispatch)
  }
}

/**
 * Extracts data from response object.
 *
 * @param {object} response
 *
 * @returns {Promise}
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

/**
 * Sends a Request to a backend API.
 * NB. The maim difference with regular `fetch` is the request is managed by Redux.
 *
 * @param {object}   apiRequest - the request to send (@see `ApiRequest` from '#/main/core/api/prop-types" for the expected format).
 * @param {function} dispatch   - the redux action dispatcher
 */
function apiFetch(apiRequest, dispatch) {
  // add default parameters
  const requestParameters = merge({}, ApiRequestTypes.defaultProps, apiRequest)
  if (!requestParameters.id) {
    requestParameters.id = makeId()
  }

  // validate parameters
  checkPropTypes(ApiRequestTypes.propTypes, requestParameters, 'prop', 'API_REQUEST')

  handleBefore(dispatch, requestParameters, requestParameters.before)

  return fetch(getUrl(requestParameters.url), requestParameters.request)
    .then(
      response => handleResponse(dispatch, response, requestParameters)
    )
    .then(
      responseData  => handleResponseSuccess(dispatch, responseData, requestParameters.success),
      responseError => handleResponseError(dispatch, responseError, requestParameters, requestParameters.error)
    )
}

export {
  apiFetch
}