import React, {PropTypes as T} from 'react'

export const PairItemDragPreview = props => {
  return (
    <div className="pair-item-preview">
      {props.item.data ?
        <div dangerouslySetInnerHTML={{__html: props.item.data}}></div>
        :
        <div>DRAGGING ITEM</div>
      }
    </div>
  )
}

PairItemDragPreview.propTypes = {
  item: T.object.isRequired
}
