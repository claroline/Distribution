import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const AuthenticationComponent = (props) =>
  <div>
    Authentication
  </div>


AuthenticationComponent.propTypes = {
}

const Authentication = connect(
  null,
  dispatch => ({ })
)(AuthenticationComponent)

export {
  Authentication
}
