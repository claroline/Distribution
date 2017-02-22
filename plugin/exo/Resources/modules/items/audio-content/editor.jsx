import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'

export const AudioContent = (props) =>
  <div className="audio-item-content">
    <audio controls>
      /*<source src={props.item.file.data || asset(props.item.file.url || '')} type={props.item.file.type || ''} />*/
      <source src={asset('data/aaaaaaaaaaaaaaaaaaaa/flo.mp3')} type={props.item.file.type || ''} />
    </audio>
  </div>

AudioContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    file: T.object,
    _errors: T.object
  }).isRequired
}
