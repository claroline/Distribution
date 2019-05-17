import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import {asset} from '#/main/app/config/asset'

import {selectors} from '#/main/core/resources/file/store'
import {HtmlText} from '#/main/core/layout/components/html-text'

import {constants} from '#/plugin/audio-player/files/audio/constants'
import {Audio as AudioType} from '#/plugin/audio-player/files/audio/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

const Transcripts = props =>
  <div className="transcripts">
    {props.transcripts.map((transcript, idx) =>
      <HtmlText key={`transcript-${idx}`}>
        {transcript}
      </HtmlText>
    )}
  </div>

Transcripts.propTypes = {
  transcripts: T.arrayOf(T.string)
}

class Audio extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ongoingSections: []
    }
  }

  render() {
    return (
      <div className="audio-resource-player">
        {0 < this.state.ongoingSections.length &&
        0 < this.props.file.sections.filter(s => -1 < this.state.ongoingSections.indexOf(s.id) && s.showTranscript && s.transcript).length &&
          <Transcripts
            transcripts={this.props.file.sections
              .filter(s => -1 < this.state.ongoingSections.indexOf(s.id) && s.showTranscript && s.transcript)
              .map(s => s.transcript)
            }
          />
        }
        <Waveform
          id={`resource-audio-${this.props.file.id}`}
          url={asset(this.props.file.hashName)}
          editable={constants.USER_TYPE === this.props.file.sectionsType}
          rateControl={this.props.file.rateControl}
          regions={constants.MANAGER_TYPE === this.props.file.sectionsType && this.props.file.sections ? this.props.file.sections : []}
          eventsCallbacks={{
            'region-in': (region) => {
              const newOngoingSections = cloneDeep(this.state.ongoingSections)

              if (-1 === newOngoingSections.indexOf(region.id)) {
                newOngoingSections.push(region.id)
                this.setState({ongoingSections: newOngoingSections})
              }
            },
            'region-out': (region) => {
              const newOngoingSections = cloneDeep(this.state.ongoingSections)
              const idx = newOngoingSections.indexOf(region.id)

              if (-1 < idx) {
                newOngoingSections.splice(idx, 1)
                this.setState({ongoingSections: newOngoingSections})
              }
            }
          }}
        />
      </div>
    )
  }
}

Audio.propTypes = {
  mimeType: T.string.isRequired,
  file: T.shape(AudioType.propTypes).isRequired
}

const AudioPlayer = connect(
  (state) => ({
    mimeType: selectors.mimeType(state)
  })
)(Audio)

export {
  AudioPlayer
}
