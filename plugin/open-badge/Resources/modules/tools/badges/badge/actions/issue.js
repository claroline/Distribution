import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {url} from '#/main/app/api/router'

/**
 * Displays a general information about a resource node.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 */
export default (rows) => ({
  type: CALLBACK_BUTTON,
  icon: 'fa fa-fw fa-save',
  label: trans('push-to-backpack'),
  scope: ['object'],
  displayed: true,
  callback: () => {
    const urlParams = new URLSearchParams(window.location.search)
    const myParam = urlParams.get('access_token')

    if (!myParam) {
      connect()
    }
    issue(rows[0]['data'])
  }
})

const connect = () => {
  OpenBadges.connect({
    callback: window.location.href,
    scope: ['issue']
  })
}

const issue = (assertion) => {
  const urlParams = new URLSearchParams(window.location.search)
  const myParam = urlParams.get('access_token')
  const apiRoot = urlParams.get('api_root')

  const assertionData = JSON.stringify({
    badge: assertion
  })

  const url = apiRoot + '/issue'

  const requestOptions = {
    method : 'POST',
    headers: {
      'Authorization': 'Bearer ' + btoa(myParam),
      'Content-Type': 'application/json'
    },
    body: assertionData
  }

  fetch(url, requestOptions).then(response => {
    console.log(response)
  })
}
