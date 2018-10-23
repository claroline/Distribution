import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const SessionsComponent = (props) =>
  <div>
    Sessions
  </div>


SessionsComponent.propTypes = {
}

const Sessions = connect(
  null,
  dispatch => ({ })
)(SessionsComponent)

export {
  Sessions
}
