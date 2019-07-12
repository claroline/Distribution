import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api'
import {selectors} from '#/main/app/security/registration/store/selectors'

const Registration = props => {
  const link = props.defaultWorkspaces[0] ?
    `<a href='${url(['claro_workspace_subscription_url_generate_user', {workspace: props.defaultWorkspaces[0].id}])}'>${trans('here')}</a>`:
    null

  return (
    <div>
      {link &&
        <div className="well" dangerouslySetInnerHTML={{__html: trans('register_to_workspace_account_exists', {'link': link})}}/>
      }
      <div>
        <div>{trans('following_workspace_registration')}</div>
        <ul>
          {props.defaultWorkspaces.map(defaultWorkspace =>
            <li key={defaultWorkspace.id}> {defaultWorkspace.name} </li>
          )}
        </ul>
      </div>
    </div>
  )
}

Registration.propTypes = {
  defaultWorkspaces: T.array.isRequired
}

const ConnectedRegistration = connect(
  (state) => ({
    defaultWorkspaces: selectors.defaultWorkspaces(state)
  }),
  null
)(Registration)

export {
  ConnectedRegistration as Registration
}
