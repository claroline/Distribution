import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

class Root extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>root</div>)
  }
}


const ConnectedRoot = connect(
  state => ({
  }),
  dispatch => ({
  })
)(Root)

export {
  ConnectedRoot as WorkspaceRoot
}
