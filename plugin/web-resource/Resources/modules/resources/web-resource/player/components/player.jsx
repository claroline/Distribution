import React from 'react'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {selectors as resourceSelector} from '#/main/core/resource/store'

import {select} from '#/plugin/web-resource/resources/web-resource/selectors'

const PlayerComponent = props => {

  const iframe = document.getElementById('web-resource-iframe')
  // const resize = (iframe) => iframe.height
  // .contentWindow.document.body.scrollHeight

  return (
    <div>
      {console.log(iframe)}
      <iframe
        className="web-resource"
        id="web-resource-iframe"
        src={`${asset('uploads/webresource/')}${props.workspaceId}/${props.path}`}
        allowFullScreen={true}
      />
    </div>
  )
}




const Player = connect(
  state => ({
    path: select.path(state),
    workspaceId: resourceSelector.resourceNode(state).workspace.id
  })
)(PlayerComponent)

export {
  Player
}
