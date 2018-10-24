import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const SecurityComponent = (props) =>
  <div>
    portal
  </div>


SecurityComponent.propTypes = {
}

const Security = connect(
  null,
  dispatch => ({ })
)(SecurityComponent)

export {
  Security
}
