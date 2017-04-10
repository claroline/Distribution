import React, { Component, PropTypes as T } from 'react'
import { DragLayer } from 'react-dnd'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  color: 'black'
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform: transform,
    WebkitTransform: transform
  }
}

class CustomDragLayerComponent extends Component {
  render() {
    const { item, isDragging } = this.props
    if (!isDragging) {
      return null
    }

    return (
      <div className="custom-drag-layer">
        <div style={getItemStyles(this.props)}>
          {item.previewComponnent(item.props)}
        </div>
      </div>
    )
  }
}

CustomDragLayerComponent.propTypes = {
  item: T.object,
  itemType: T.string,
  currentOffset: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }),
  isDragging: T.bool.isRequired
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

const CustomDragLayer = DragLayer(collect)(CustomDragLayerComponent)

export {CustomDragLayer}
