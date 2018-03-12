import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {select as resourceSelect} from '#/main/core/resource/selectors'

const PlayerComponent = props =>
  <video
    className="video-js vjs-big-play-centered vjs-default-skin vjs-16-9 vjs-waiting"
    height="auto"
    width="320"
    controls
    data-download={props.canDownload}
    data-setup={[]}
  >
    <source src={props.url} type={props.resource.meta.mimeType} />
  </video>

PlayerComponent.propTypes = {
  resource: T.shape({
    meta: T.shape({
      mimeType: T.string.isRequired
    }).isRequired
  }).isRequired,
  url: T.string.isRequired,
  canDownload: T.bool.isRequired
}

const Player = connect(
  state => ({
    resource: state.resourceNode,
    url: state.url,
    canDownload: resourceSelect.exportable(state)
  })
)(PlayerComponent)

export {
  Player
}