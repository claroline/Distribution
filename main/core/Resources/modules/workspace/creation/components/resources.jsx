import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {Logs} from '#/main/core/workspace/creation/components/log/components/logs.jsx'

class Resources extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>resources<Logs/></div>)
  }
}


const ConnectedResources = connect(
  state => ({
  }),
  dispatch => ({
  })
)(Resources)

export {
  ConnectedResources as WorkspaceResources
}
