import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const ImageContentPlayer = (props) =>
  <div className="image-item-content">
    <img src={props.item.file.data || asset(props.item.file.url)} />
  </div>

ImageContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.oneOfType([
      T.shape({
        data: T.string.isRequired,
        width: T.number.isRequired
      }),
      T.shape({
        url: T.string.isRequired,
        width: T.number.isRequired
      })
    ]).isRequired,
  }).isRequired
}
