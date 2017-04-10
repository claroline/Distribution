import React, {Component, PropTypes as T} from 'react'

const style = {
  width: '100%',
  height: '100%',
  minWidth: '150px',
  minHeight: '50px',
  backgroundColor: '#aaa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.5,
  borderRadius: '5px',
  margin: '15px'
}

export const OrderingItemDragPreview = props => {
  return (
    <div style={style}>
      {props.data ?
        <div dangerouslySetInnerHTML={{__html: props.data}}></div>
        :
        <div>DRAGGING ITEM</div>
      }
    </div>
  )
}
