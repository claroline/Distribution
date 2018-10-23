import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const PortalComponent = (props) =>
  <div>
    portal
  </div>


PortalComponent.propTypes = {
}

const Portal = connect(
  null,
  dispatch => ({ })
)(PortalComponent)

export {
  Portal
}
