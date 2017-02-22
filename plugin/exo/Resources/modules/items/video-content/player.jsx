import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const VideoContentPlayer = (props) =>
  <div className="video-item-content">
    <video controls>
      <source src={props.item.file.data || asset(props.item.file.url)} type={props.item.file.type} />
    </video>
  </div>

VideoContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.oneOfType([
      T.shape({
        data: T.string.isRequired,
        type: T.string.isRequired
      }),
      T.shape({
        url: T.string.isRequired,
        type: T.string.isRequired
      })
    ]).isRequired,
  }).isRequired
}
