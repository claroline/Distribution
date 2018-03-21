import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/api/router'

const PlayerComponent = props =>
  <div className="pdf-player">
      <canvas id="the-canvas" className="pdf-player-page"></canvas>
  </div>

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