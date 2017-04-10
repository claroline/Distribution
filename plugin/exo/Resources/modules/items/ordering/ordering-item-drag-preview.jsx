import React, {PropTypes as T} from 'react'

export const OrderingItemDragPreview = props => {
  return (
    <div className="ordering-item-preview">
      {props.data ?
        <div dangerouslySetInnerHTML={{__html: props.data}}></div>
        :
        <div>DRAGGING ITEM</div>
      }
    </div>
  )
}


OrderingItemDragPreview.propTypes = {
  data: T.string.isRequired
}
