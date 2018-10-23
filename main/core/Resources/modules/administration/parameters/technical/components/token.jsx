import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const TokenComponent = (props) =>
  <div>
    Token
  </div>


TokenComponent.propTypes = {
}

const Token = connect(
  null,
  dispatch => ({ })
)(TokenComponent)

export {
  Token
}
