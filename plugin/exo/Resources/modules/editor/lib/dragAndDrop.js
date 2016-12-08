import {DragSource, DropTarget} from 'react-dnd'

// see https://gaearon.github.io/react-dnd/examples-sortable-simple.html
export function makeDraggable(component, type) {
  const source = {
    beginDrag(props) {
      return {
        item: props.item
      }
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
      props.onDrop(monitor.getItem(), props)
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
