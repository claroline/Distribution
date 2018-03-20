import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/api/router'

const PlayerComponent = props =>
  <video
    className="video-js vjs-big-play-centered vjs-default-skin vjs-16-9 vjs-waiting"
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
  url: T.string.isRequired
}

const Player = connect(
  state => ({
    resource: state.resourceNode,
    url: state.url
  })
)(PlayerComponent)

export {
  Player
}