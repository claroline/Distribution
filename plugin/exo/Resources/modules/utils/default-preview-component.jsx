import React, {PropTypes as T} from 'react'

const style = {
  width: '100%',
  height: '100%',
  minWidth: '100px',
  minHeight: '50px',
  backgroundColor: '#aaa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.5,
  borderRadius: '5px'
}

export const DefaultPreviewComponent = props =>
  <div style={style}>
    {props.title || props.data || 'DRAGGING'}
  </div>
