import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const ImageContent = (props) =>
  <div className="image-item-content">
    <img src={props.item.file.data || asset(props.item.file.url || '')} />
  </div>

ImageContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.object,
    _errors: T.object
  }).isRequired
}
