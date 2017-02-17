import React, {PropTypes as T} from 'react'

export const AudioContentPlayer = (props) =>
  <div>
    Audio content
  </div>

AudioContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired
  }).isRequired
}
