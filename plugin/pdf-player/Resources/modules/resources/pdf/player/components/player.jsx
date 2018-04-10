import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/api/router'

class PlayerComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pdf: null,
      scale: 1.2
    }
  }

  componentDidMount() {
    PDFJS.getDocument(this.props.url).then((pdf) => {
      console.log(pdf)
      this.setState({ pdf })
    })
  }

  render() {
    return (
      <div className="pdf-player">
        <canvas id="the-canvas" className="pdf-player-page"></canvas>
      </div>
    )
  }
}

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