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
    OpenBadges.issue([url(['apiv2_open_badge__assertion', {assertion: rows[0].id}, true])], (errors, successes) => {
      console.log(errors)
      console.log(successes)
    })
  }
})
/*
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
  console.log('Bearer ' + btoa(myParam))

  const requestOptions = {
    method : 'POST',
    headers: new Headers({
      'Authorization': 'Bearer ' + btoa(myParam),
      'Content-Type': 'application/json'
    }),
    body: assertionData
  }

  fetch(url, requestOptions).then(response => {
    console.log(response)
  })
}*/
