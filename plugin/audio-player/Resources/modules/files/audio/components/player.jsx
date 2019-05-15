import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/app/config/asset'

import {selectors} from '#/main/core/resources/file/store'

import {Audio as AudioType} from '#/plugin/audio-player/files/audio/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

const Audio = props =>
  <div>
    <Waveform
      id={`resource-audio-${props.file.id}`}
      url={asset(props.file.hashName)}
      eventsCallbacks={{}}
    />
  </div>

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
