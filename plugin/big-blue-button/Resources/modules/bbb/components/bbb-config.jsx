import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions} from '../actions'

class BBBConfig extends Component {
  render() {
    return (
      <div>
        Configuration
      </div>
    )
  }
}

BBBConfig.propTypes = {
  params: T.shape({
    id: T.number,
    roomName: T.string,
    newTab: T.boolean,
    moderatorRequired: T.boolean,
    record: T.boolean
  })
}

function mapStateToProps(state) {
  return {
    params: state.resource
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedBBBConfig = connect(mapStateToProps, mapDispatchToProps)(BBBConfig)

export {ConnectedBBBConfig as BBBConfig}