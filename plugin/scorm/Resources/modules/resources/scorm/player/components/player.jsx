import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {Scorm as ScormType} from '#/plugin/scorm/resources/scorm/prop-types'
import {actions} from '#/plugin/scorm/resources/scorm/player/actions'
import {select} from '#/plugin/scorm/resources/scorm/selectors'

class PlayerComponent extends Component {
  componentDidMount() {
    this.props.initializeScormAPI(this.props.scorm.scos[0], this.props.scorm, this.props.trackings)
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
  }),
  dispatch => ({
    initializeScormAPI(sco, scorm, trackings) {
      dispatch(actions.initializeAPI(sco, scorm, trackings))
    }
  })
)(PlayerComponent)

export {
  Player
}
