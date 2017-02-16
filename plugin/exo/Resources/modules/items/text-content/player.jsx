import React, {PropTypes as T} from 'react'

export const TextContentPlayer = (props) =>
  <div dangerouslySetInnerHTML={{ __html: props.item.text }}>
  </div>

TextContentPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired
  }).isRequired
}
