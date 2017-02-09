import React, {PropTypes as T} from 'react'

export const GridPlayer = () =>
  (
    <span>GRID PLAYER</span>
  )

GridPlayer.propTypes = {
  item: T.object.isRequired,
  answer: T.object.isRequired
}
