import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

// import {trans} from '#/main/core/translation'

const PlayerComponent = props =>
  <video
    className="video-js vjs-big-play-centered vjs-default-skin vjs-16-9 vjs-waiting"
    height="auto"
    width="320"
    controls
    data-download="true"
    data-setup={{}}
  >
    {/*<source src="{{ url('claro_file_get_media', {'node': video.resourceNode.id}) }}" type="{{ video.resourceNode.mimeType }}" />*/}
  </video>

PlayerComponent.propTypes = {
  // video: T.object.isRequired
}

const Player = connect(
  state => ({
    // video: state.resource
  })
)(PlayerComponent)

export {
  Player
}