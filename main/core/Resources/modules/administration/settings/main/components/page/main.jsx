import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const MainComponent = (props) =>
  <div>
    MAIN
  </div>


MainComponent.propTypes = {
}

const Main = connect(
  null,
  dispatch => ({ })
)(MainComponent)

export {
  Main
}
