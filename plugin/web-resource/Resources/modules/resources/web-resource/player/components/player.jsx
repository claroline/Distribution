import React, {Component} from 'react'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {selectors as resourceSelector} from '#/main/core/resource/store'

import {select} from '#/plugin/web-resource/resources/web-resource/selectors'

class PlayerComponent extends Component {

  componentDidMount() {
    const iframe = document.getElementById('web-resource-iframe')
    const height = iframe.contentWindow.document.body.scrollHeight
    return height
  }

  render() {

    return (
      <div>
        <iframe
          className="web-resource"
          id="web-resource-iframe"
          height={this.height}
          src={`${asset('uploads/webresource/')}${this.props.workspaceId}/${this.props.path}`}
          allowFullScreen={true}
        />
      </div>
    )
  }
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
