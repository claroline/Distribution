import React, {PropTypes as T} from 'react'
import {resizeArea} from './../resize'
import {AnswerArea} from './answer-area.jsx'


export const ResizeDragLayer = props => {
  console.log(props)
  const area = props.areas.find(area => area.id === props.areaId)

  return (
    <AnswerArea
      id="area-drag-preview"
      color={area.color}
      shape={area.shape}
      geometry={resizeArea(
        area,
        props.position,
        props.currentOffset.x,
        props.currentOffset.y
      )}
      selected={true}
      resizable={false}
      canDrag={false}
      isDragging={false}
      onSelect={() => {}}
      onDelete={() => {}}
      togglePopover={() => {}}
      connectDragSource={el => el}
    />
  )
}

ResizeDragLayer.propTypes = {
  areaId: T.string,
  position: T.string,
  currentOffset: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }),
  areas: T.arrayOf(T.shape({
    id: T.string.isRequired,
    shape: T.string.isRequired,
    color: T.string.isRequired
  })).isRequired
}
/*
function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getDifferenceFromInitialOffset()
  }
}

const ResizeDragLayerDecorated = DragLayer(collect)(ResizeDragLayer)

export {ResizeDragLayerDecorated as ResizeDragLayer}*/
