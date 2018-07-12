//Utiliser un WorkspaceComponentTools qui vient de workspace/components/tools.jsx

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

class Tools extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}


const ConnectedTools = connect(
  state => ({
    model: state.model
  }),
  dispatch => ({
  })
)(Tools)

export {
  ConnectedTools as WorkspaceTools
}
