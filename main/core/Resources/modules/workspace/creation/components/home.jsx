import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>home</div>)
  }
}


const ConnectedHome = connect(
  state => ({
  }),
  dispatch => ({
  })
)(Home)

export {
  ConnectedHome as WorkspaceHome
}
