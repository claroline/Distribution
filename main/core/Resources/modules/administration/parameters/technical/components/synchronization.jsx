import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const SynchronizationComponent = (props) =>
  <div>
    Synchronization
  </div>


SynchronizationComponent.propTypes = {
}

const Synchronization = connect(
  null,
  dispatch => ({ })
)(SynchronizationComponent)

export {
  Synchronization
}
