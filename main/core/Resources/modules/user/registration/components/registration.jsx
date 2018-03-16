import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {select} from '#/main/core/user/registration/selectors'

/**
 * @constructor
 */
const Registration = props =>
  <div>
    {props.defaultWorkspaces.map(defaultWorkspace =>
      <span key={defaultWorkspace.id}> {defaultWorkspace.name} </span>
    )}
  </div>

Registration.propTypes = {
  defaultWorkspaces: T.array.isRequired
}

const ConnectedRegistration = connect(
  (state) => ({
    defaultWorkspaces: select.defaultWorkspaces(state)
  }),
  null
)(Registration)

export {
  ConnectedRegistration as Registration
}
