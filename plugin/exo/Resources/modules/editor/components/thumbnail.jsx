import React from 'react'
import classes from 'classnames'
import {t, tex} from './../lib/translate'
import {makeSortable} from './../lib/sortable'
import {MODAL_DELETE_CONFIRM} from './modals.jsx'
import {TYPE_STEP, TYPE_QUIZ} from './../types'

const T = React.PropTypes

const Actions = props =>
  <span className="step-actions">
    <span
      role="button"
      title={tex('delete_step')}
      className="fa fa-trash-o"
      onClick={e => {
        e.stopPropagation()
        props.showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_step'),
          question: tex('remove_step_confirm_message'),
          handleConfirm: () => props.onDeleteClick(props.id)
        })
      }}
    />
    {props.connectDragSource(
      <span
        role="button"
        title={t('move')}
        className="fa fa-bars drag-handle"
        draggable="true"
      />
    )}
  </span>

Actions.propTypes = {
  onDeleteClick: T.func.isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired
}

let Thumbnail = props => {
  return props.connectDragPreview(
    props.connectDropTarget(
      <span
        className={classes('thumbnail', {'active': props.active})}
        onClick={() => props.onClick(props.id, props.type)}
        style={{opacity: props.isDragging ? 0 : 1}}
      >
        {props.type === TYPE_QUIZ && <span className="step-actions"/>}
        {props.type === TYPE_STEP && <Actions {...props}/>}
        <a
          className="step-title
          "href="#/alt-editor"
        >
          {props.title}
        </a>
        <span className="step-bottom"></span>
      </span>
    )
  )
}

Thumbnail.propTypes = {
  id: T.string.isRequired,
  index: T.number.isRequired,
  type: T.string.isRequired,
  title: T.string.isRequired,
  active: T.bool.isRequired,
  onClick: T.func.isRequired,
  onDeleteClick: T.func.isRequired,
  onSort: T.func.isRequired,
  sortDirection: T.string.isRequired,
  showModal: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired
}

Thumbnail = makeSortable(Thumbnail, 'THUMBNAIL')

export {Thumbnail}
