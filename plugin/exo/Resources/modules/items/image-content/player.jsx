import React, {PropTypes as T} from 'react'

export const ImageContentPlayer = (props) =>
  <div>
    Image content
  </div>

ImageContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired
  }).isRequired
}
