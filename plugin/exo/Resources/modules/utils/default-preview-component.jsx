import React, {PropTypes as T} from 'react'

export const DefaultPreviewComponent = props =>
  <div className="default-item-preview">
    {props.title || 'DRAGGING...'}
  </div>

DefaultPreviewComponent.propTypes = {
  title: T.string
}
