import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const LimitsComponent = (props) =>
  <div>
    plugins
  </div>


LimitsComponent.propTypes = {
}

const Limits = connect(
  null,
  dispatch => ({ })
)(LimitsComponent)

export {
  Limits
}
