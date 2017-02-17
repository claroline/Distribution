import React, {PropTypes as T} from 'react'

export const VideoContentPlayer = (props) =>
  <div>
    Video content
  </div>

VideoContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired
  }).isRequired
}
