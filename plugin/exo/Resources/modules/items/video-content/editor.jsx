import React, {Component, PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'
import videojs from 'video.js'

class VideoPlayer extends Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return (
      <video ref={ node => this.videoNode = node } className="video-js vjs-big-play-centered vjs-default-skin vjs-16-9" controls>
        <source src={this.props.item.file.data || asset(this.props.item.file.url)} type={this.props.item.file.type}/>
      </video>
    )
  }
}

export const VideoContent = (props) =>
  <div className="video-item-content">
    {(props.item.file.data || props.item.file.url) &&
      <VideoPlayer { ...props} />
    }
  </div>

VideoContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.object,
    _errors: T.object
  }).isRequired
}
