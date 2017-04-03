import {PropTypes as T} from 'react'
import {DropTarget} from 'react-dnd'
import {FILE} from './../../quiz/enums'

const fileTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem().files)
  }
}

let FileDropZone = ({connectDropTarget, children}) =>
  connectDropTarget(children)

FileDropZone.propTypes = {
  connectDropTarget: T.func.isRequired,
  onDrop: T.func.isRequired,
  children: T.element.isRequired
}

FileDropZone = DropTarget(FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(FileDropZone)

export {FileDropZone}
