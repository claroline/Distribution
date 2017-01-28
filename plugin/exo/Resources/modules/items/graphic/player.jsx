import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const GraphicPlayer = props =>
  <div className="graphic-player">
    <img src={props.item.image.data || asset(props.item.image.url)}></img>
  </div>

GraphicPlayer.propTypes = {
  item: T.shape({
    image: T.oneOfType([
      {data: T.string.isRequired},
      {url: T.string.isRequired}
    ]).isRequired
  }).isRequired
}
