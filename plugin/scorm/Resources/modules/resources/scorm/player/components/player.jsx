import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {Scorm as ScormType} from '#/plugin/scorm/resources/scorm/prop-types'
import {initializeAPI} from '#/plugin/scorm/resources/scorm/api'
import {select} from '#/plugin/scorm/resources/scorm/selectors'

class PlayerComponent extends Component {
  componentDidMount() {
    initializeAPI(this.props.scorm.scos[0], this.props.scorm, this.props.trackings)
  }

  render() {
    return (
      <iframe
        className="scorm-iframe"
        src={`${asset('uploads/scormresources/')}${this.props.workspaceUuid}/${this.props.scorm.hashName}/${this.props.scorm.scos[0].data.entryUrl}`}
      />
    )
  }
}

PlayerComponent.propTypes = {
  scorm: T.shape(ScormType.propTypes),
  trackings: T.object,
  workspaceUuid: T.string.isRequired
}

const Player = connect(
  state => ({
    scorm: select.scorm(state),
    trackings: select.trackings(state),
    workspaceUuid: resourceSelect.resourceNode(state).workspace.id
  })
)(PlayerComponent)

export {
  Player
}
