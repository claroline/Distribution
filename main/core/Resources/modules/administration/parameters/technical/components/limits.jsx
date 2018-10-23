import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const PluginsComponent = (props) =>
  <div>
    plugins
  </div>


PluginsComponent.propTypes = {
}

const Plugins = connect(
  null,
  dispatch => ({ })
)(PluginsComponent)

export {
  Plugins
}
