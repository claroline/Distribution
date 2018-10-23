import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const MaintenanceComponent = (props) =>
  <div>
    Maintenance
  </div>


MaintenanceComponent.propTypes = {
}

const Maintenance = connect(
  null,
  dispatch => ({ })
)(MaintenanceComponent)

export {
  Maintenance
}
