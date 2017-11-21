import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {t, tex} from '#/main/core/translation'

import {SORT_DETECT, makeSortable} from './../../../utils/sortable'
import {TYPE_STEP, TYPE_QUIZ} from './../../enums'
import {ValidationStatus} from '#/plugin/exo/components/validation-status.jsx'

const Actions = props =>
  <span className="step-actions">
    <button
      type="button"
      className="btn btn-link-danger"
      onClick={e => {
        e.stopPropagation()
        props.onDeleteClick(props.id)
      }}
    >
      <span className="fa fa-fw fa-trash-o" />
      <span className="sr-only">{tex('delete_step')}</span>
    </button>

    {props.connectDragSource(
      <span
        role="button"
        className="btn btn-link-default drag-handle"
        draggable="true"
      >
        <span className="fa fa-fw fa-arrows" />
        <span className="sr-only">{t('move')}</span>
      </span>
    )}
  </span>

Actions.propTypes = {
  id: T.string.isRequired,
  onDeleteClick: T.func.isRequired,
  connectDragSource: T.func.isRequired
}

let Thumbnail = props => props.connectDropTarget(
  <a
    className={classes('thumbnail', {'active': props.active})}
    href={TYPE_QUIZ === props.type ? '#/edit/parameters' : `#/edit/steps/${props.id}`}
    style={{opacity: props.isDragging ? 0 : 1}}
  >
    {props.type === TYPE_QUIZ && <span className="step-actions" />}
    {props.type === TYPE_STEP && <Actions {...props} />}

    <span className={classes('step-title', {'type-quiz': props.type === TYPE_QUIZ})}>
      {props.title}
    </span>

    <span className="step-bottom">
      {props.hasErrors &&
        <ValidationStatus id={`${props.id}-thumb-tip`} validating={props.validating} />
      }
    </span>
  </a>
)

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
  validating: T.bool.isRequired,
  hasErrors: T.bool.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired
}

const ThumbnailDragPreview = props =>
  <span className="thumbnail">
    <a className="step-title">
      {props.title}
    </a>
  </span>

ThumbnailDragPreview.propTypes = {
  title: T.string.isRequired
}

Thumbnail = makeSortable(
  Thumbnail,
  'THUMBNAIL',
  ThumbnailDragPreview
)

class ThumbnailBox extends Component {
  constructor(props) {
    super(props)
    // simple transient flag indicating scrolling is needed
    this.state = {addedThumbnail: false}
    this.node = null
  }

  componentDidUpdate() {
    if (this.state.addedThumbnail) {
      this.node.scrollTop = this.node.scrollHeight
      this.node.scrollLeft = this.node.scrollWidth
      this.setState({addedThumbnail: false})
    }
  }

  render() {
    return (
      <nav
        className="thumbnail-box scroller"
        ref={node => this.node = node}
      >
        {this.props.thumbnails.map((item, index) =>
          <Thumbnail
            id={item.id}
            key={`${item.type}-${item.id}`}
            index={index}
            title={item.title}
            type={item.type}
            active={item.active}
            validating={this.props.validating}
            hasErrors={item.hasErrors}
            onClick={this.props.onThumbnailClick}
            onDeleteClick={this.props.onStepDeleteClick}
            onSort={this.props.onThumbnailMove}
            sortDirection={SORT_DETECT}
          />
        )}

        <button
          type="button"
          className="btn new-step"
          onClick={() => {
            this.props.onNewStepClick(this.props.thumbnails.length)
            this.setState({addedThumbnail: true})
          }}
        >
          +
        </button>
      </nav>
    )
  }
}

ThumbnailBox.propTypes = {
  thumbnails: T.arrayOf(T.object).isRequired,
  validating: T.bool.isRequired,
  onNewStepClick: T.func.isRequired,
  onStepDeleteClick: T.func.isRequired,
  onThumbnailClick: T.func.isRequired,
  onThumbnailMove: T.func.isRequired
}

export {
  ThumbnailBox
}
