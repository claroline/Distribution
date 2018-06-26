import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {Scorm as ScormType} from '#/plugin/scorm/resources/scorm/prop-types'
import '#/plugin/scorm/resources/scorm/api'

const PlayerComponent = props =>
  <iframe
    className="scorm-iframe"
    src={`${asset('uploads/scormresources/')}${props.workspaceUuid}/${props.scorm.hashName}/${props.scorm.scos[0].data.entryUrl}`}
  />

PlayerComponent.propTypes = {
  scorm: T.shape(ScormType.propTypes),
  workspaceUuid: T.string.isRequired
}

const Player = connect(
  state => ({
    scorm: state.scorm,
    workspaceUuid: resourceSelect.resourceNode(state).workspace.id
  })
)(PlayerComponent)

export {
  Player
}
