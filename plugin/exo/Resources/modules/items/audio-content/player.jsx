import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const AudioContentPlayer = (props) =>
  <div className="audio-item-content">
    <audio controls>
      <source src={asset(props.item.file.url)} type={props.item.file.type} />
    </audio>
  </div>

AudioContentPlayer.propTypes = {
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
