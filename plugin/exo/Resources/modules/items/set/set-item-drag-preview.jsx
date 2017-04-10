import React, {Component, PropTypes as T} from 'react'

export const SetItemDragPreview = props => {
  return (
    <div className="set-item-preview">
      {props.item.data ?
        <div dangerouslySetInnerHTML={{__html: props.item.data}}></div>
        :
        <div>DRAGGING ITEM</div>
      }
    </div>
  )
}
