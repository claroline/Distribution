import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {defaultModel} from './model.default.js'

class Roles extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {defaultModel.roles.map(role => <span key={role.id}>{role.translationKey}</span> )}
      </div>
    )
  }
}


const ConnectedRoles = connect(
  state => ({
    model: state.workspaces.creation.model
  }),
  dispatch => ({
  })
)(Roles)

export {
  ConnectedRoles as WorkspaceRoles
}
