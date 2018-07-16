//Utiliser un WorkspaceComponentTools qui vient de workspace/components/tools.jsx

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {defaultModel} from './model.default.js'

class Tools extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {defaultModel.orderedTools.map(orderedTool => <span key={orderedTool.id}>{orderedTool.tool.name}</span> )}
      </div>
    )
  }
}


const ConnectedTools = connect(
  state => ({
    model: state.workspaces.creation.model
  }),
  dispatch => ({
  })
)(Tools)

export {
  ConnectedTools as WorkspaceTools
}
