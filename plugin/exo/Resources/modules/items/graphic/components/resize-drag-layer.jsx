import React, {Component, PropTypes as T} from 'react'
import {DragLayer} from 'react-dnd'
import {TYPE_AREA_RESIZER, SHAPE_RECT} from './../enums'
import {AnswerArea} from './answer-area.jsx'

// this class doesn't hold any state but the drag layer decorator
// requires it to be a "full" component, not a stateless function
class ResizeDragLayer extends Component {
  computeNewGeometry(area, resizerPosition, offset) {
    if (area.shape === SHAPE_RECT) {
      switch (resizerPosition) {
        case 's':
          return {
            coords: [
              area.coords[0],
              Object.assign({}, area.coords[1], {y: area.coords[1].y + offset.y})
            ]
          }
      }
    }
  }

  render() {
    if (
      !this.props.canDrag ||
      !this.props.isDragging ||
      !this.props.currentOffset ||
      this.props.itemType !== TYPE_AREA_RESIZER
    ) {
      return null
    }

    const area = this.props.areas.find(area => area.id === this.props.item.areaId)

    return (
      <AnswerArea
        id="area-drag-preview"
        color={area.color}
        shape={area.shape}
        geometry={this.computeNewGeometry(
          area,
          this.props.item.position,
          this.props.currentOffset
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
}

ResizeDragLayer.propTypes = {
  item: T.object,
  itemType: T.string,
  canDrag: T.bool.isRequired,
  isDragging: T.bool.isRequired,
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

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getDifferenceFromInitialOffset()
  }
}

ResizeDragLayer = DragLayer(collect)(ResizeDragLayer)

export {ResizeDragLayer}
