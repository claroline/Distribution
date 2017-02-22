import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const VideoContent = (props) =>
  <div className="video-item-content">
    <video controls>
      /*<source src={props.item.file.data || asset(props.item.file.url || '')} type={props.item.file.type || ''} />*/
      <source src={asset('data/aaaaaaaaaaaaaaaaaaaa/david_blaine.mp4')} type={props.item.file.type || ''} />
    </video>
  </div>

VideoContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.object,
    _errors: T.object
  }).isRequired
}
