import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'
import invariant from 'invariant'



// see https://gaearon.github.io/react-dnd/examples-sortable-simple.html
export function makeDraggable(component, type) {
  const source = {
    beginDrag(props) {
      console.log(props)
      return {
        id: props.item.id
      }
    },
    endDrag(props, monitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      console.log('endDrag')
      console.log(item)
      console.log(dropResult)
      if (dropResult) {
        window.alert( // eslint-disable-line no-alert
          `You dropped ${item.id} into ${dropResult.name}!`
        )
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
  console.log('yep')
  const boxTarget = {
    drop() {
      console.log('tralala')
      return { name: 'Dustbin' }
    }
  }
  let target = {
    drop(props, monitor) {
      console.log('youpi')
      //props.onDrop(monitor.getItem())
      return {id: 'fakeid'}
    }
  }
  component = DropTarget(type, boxTarget, collectDrop)(component)
  return component
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}
