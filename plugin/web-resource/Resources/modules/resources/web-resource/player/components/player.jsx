import React from 'react'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'

import {select} from '#/plugin/web-resource/resources/web-resource/selectors'

const PlayerComponent = props =>
  <iframe
    className="web-resource"
    height={12}
    src={asset(props.webResource.url)}
    allowFullScreen={true}
  />


const Player = connect(
  state => ({
    webResource: select.webResource(state)
  })
)(PlayerComponent)

export {
  Player
}
