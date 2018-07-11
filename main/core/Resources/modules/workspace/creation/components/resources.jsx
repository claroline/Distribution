import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

class Resources extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>resources</div>)
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
