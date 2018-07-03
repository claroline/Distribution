import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {Scorm as ScormType, Sco as ScoType} from '#/plugin/scorm/resources/scorm/prop-types'
import {actions} from '#/plugin/scorm/resources/scorm/player/actions'
import {select} from '#/plugin/scorm/resources/scorm/selectors'
import {flattenScos, getFirstOpenableSco} from '#/plugin/scorm/resources/scorm/utils'
import {ScormSummary} from '#/plugin/scorm/resources/scorm/player/components/summary.jsx'

class PlayerComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSco: getFirstOpenableSco(props.scos)
    }
    this.openSco = this.openSco.bind(this)
  }

  componentDidMount() {
    this.props.initializeScormAPI(this.state.currentSco, this.props.scorm, this.props.trackings)
  }

  openSco(sco) {
    this.setState({currentSco: sco})
    this.props.initializeScormAPI(sco, this.props.scorm, this.props.trackings)
  }

  render() {
    return (
      <div className="scorm-player">
        {1 < this.props.scos.length &&
          <ScormSummary
            scos={this.props.scorm.scos}
            openSco={this.openSco}
          />
        }
        <div className="content-container">
          <iframe
            className="scorm-iframe"
            src={`${asset('uploads/scormresources/')}${this.props.workspaceUuid}/${this.props.scorm.hashName}/${this.state.currentSco.data.entryUrl}${this.state.currentSco.data.parameters ? this.state.currentSco.data.parameters : ''}`}
          />
        </div>
      </div>
    )
  }
}

PlayerComponent.propTypes = {
  scorm: T.shape(ScormType.propTypes),
  trackings: T.object,
  scos: T.arrayOf(T.shape(ScoType.propTypes)).isRequired,
  workspaceUuid: T.string.isRequired,
  initializeScormAPI: T.func.isRequired
}

const Player = connect(
  state => ({
    scorm: select.scorm(state),
    trackings: select.trackings(state),
    scos: flattenScos(select.scos(state)),
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
