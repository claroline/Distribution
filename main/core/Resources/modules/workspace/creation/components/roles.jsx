import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

class Roles extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>roles</div>)
  }
}


const ConnectedRoles = connect(
  state => ({
  }),
  dispatch => ({
  })
)(Roles)

export {
  ConnectedRoles as WorkspaceRoles
}
