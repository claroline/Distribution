import {DragSource, DropTarget} from 'react-dnd'

// see https://gaearon.github.io/react-dnd/examples-sortable-simple.html
export function makeDraggable(component, type, itemFactory) {
  const source = {
    beginDrag(props) {
      if (itemFactory) {
        return itemFactory(props)
      }

      return {
        item: props.item
      }
    },
    canDrag(props, monitor) {
      if (typeof props.canDrag !== 'undefined') {
        return props.canDrag
      }

      return true
    }
  }
  component = DragSource(type, source, collectDrag)(component)
  return component
}

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export function makeDroppable(component, type) {
  const target = {
    drop(props, monitor) {
      const offset = monitor.getDifferenceFromInitialOffset()
      props.onDrop(monitor.getItem(), props, offset)
    }
  }
  component = DropTarget(type, target, collectDrop)(component)
  return component
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}
