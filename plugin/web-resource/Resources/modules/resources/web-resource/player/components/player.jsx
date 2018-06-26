import React from 'react'
import {connect} from 'react-redux'

import {select} from '#/plugin/web-resource/resources/web-resource/selectors'

const PlayerComponent = props =>
  <div>Player{console.log(props.webResource)}</div>
{/* <iframe
    className="web-resource"
    height={12}
    src={props.webResource.url}
    allowFullScreen={true}
  /> */}


const Player = connect(
  state => ({
    webResource: select.webResource(state)
  })
)(PlayerComponent)

export {
  Player
}
