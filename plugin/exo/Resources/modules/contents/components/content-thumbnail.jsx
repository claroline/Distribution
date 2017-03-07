import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {makeSortable} from './../../utils/sortable'
import {t} from './../../utils/translate'
import {ValidationStatus} from './../../quiz/editor/components/validation-status.jsx'
import {getContentDefinition} from './../content-types'
import {connect} from 'react-redux'
import {showModal} from './../../modal/actions'

const Actions = props =>
  <span className="content-thumbnail-actions">
    {props.hasEditBtn &&
      <span
        role="button"
        title={t('edit')}
        className="action-button fa fa-pencil"
        onClick={e => props.handleEdit(e)}
      />
    }
    {props.hasDeleteBtn &&
      <span
        role="button"
        title={t('delete')}
        className="action-button fa fa-trash-o"
        onClick={e => props.handleDelete(e)}
      />
    }
    {props.hasSortBtn && props.connectDragSource(
      <span
        role="button"
        title={t('move')}
        className="action-button fa fa-bars drag-handle"
        draggable="true"
      />
    )}
  </span>

Actions.propTypes = {
  connectDragSource: T.func,
  hasDeleteBtn: T.bool,
  hasEditBtn: T.bool,
  hasSortBtn: T.bool,
  handleEdit: T.func,
  handleDelete: T.func
}

let ContentThumbnail = props => {
  return props.connectDragPreview(
    props.connectDropTarget(
      <span className={classes('content-thumbnail', {'active': props.active})}
            style={{opacity: props.isDragging ? 0 : 1}}
      >
        <span className="content-thumbnail-topbar">
          {props.hasErrors &&
            <ValidationStatus
              id={`${props.id}-thumb-tip`}
              validating={props.validating}
            />
          }
          <Actions
            hasDeleteBtn={props.canDelete}
            hasEditBtn={props.canEdit}
            hasSortBtn={props.canSort}
            handleEdit={props.handleEdit}
            handleDelete={props.handleDelete}
            {...props}
          />
        </span>
        <span className="content-thumbnail-content">
          {React.createElement(
            getContentDefinition(props.type).thumbnail,
            {data: props.data, type: props.type}
          )}
        </span>
      </span>
    )
  )
}

ContentThumbnail.propTypes = {
  id: T.string.isRequired,
  index: T.number.isRequired,
  data: T.string,
  type: T.string.isRequired,
  active: T.bool,
  canDelete: T.bool,
  canEdit: T.bool,
  canSort: T.bool,
  onSort: T.func,
  handleEdit: T.func,
  handleDelete: T.func,
  sortDirection: T.string,
  validating: T.bool,
  hasErrors: T.bool,
  showModal: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired
}

ContentThumbnail = makeSortable(ContentThumbnail, 'CONTENT_THUMBNAIL')


function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    showModal: (type, props) => dispatch(showModal(type, props))
  }
}

ContentThumbnail = connect(mapStateToProps, mapDispatchToProps)(ContentThumbnail)

export {ContentThumbnail}
