import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {CreationForm} from '#/main/core/workspace/creation/components/creation.jsx'

class WorkspaceCreationContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<CreationForm></CreationForm>)
  }
}


const ConnectedWorkspaceCreationContainer = connect(
  state => ({
  }),
  dispatch => ({
  })
)(WorkspaceCreationContainer)

export {
  ConnectedWorkspaceCreationContainer as WorkspaceCreation
}
