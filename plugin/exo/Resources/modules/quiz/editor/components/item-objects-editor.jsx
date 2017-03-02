import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {makeSortable} from './../../../utils/sortable'
import {tex, t} from './../../../utils/translate'
import {MODAL_DELETE_CONFIRM} from './../../../modal'
import {OBJECT_ADD} from './../actions'
import {MODAL_ADD_CONTENT} from './../components/add-content-modal.jsx'
import {actions, OBJECT_MOVE, OBJECT_REMOVE} from './../actions.js'
import {connect} from 'react-redux'
import {getContentDefinition} from './../../../contents/content-types'

const Actions = props =>
  <span className="object-actions">
    {getContentDefinition(props.object.type).type === 'text' &&
      <span
        role="button"
        title={tex('edit_object')}
        className="action-button fa fa-pencil"
        onClick={e => {
          e.stopPropagation()
        }}
      />
    }
    <span
      role="button"
      title={tex('delete_object')}
      className="action-button fa fa-trash-o"
      onClick={e => {
        e.stopPropagation()
        props.showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_object'),
          question: tex('remove_object_confirm_message'),
          handleConfirm: () => props.updateItemObjects(props.itemId, OBJECT_REMOVE, {id: props.id})
        })
      }}
    />
    {props.connectDragSource(
      <span
        role="button"
        title={t('move')}
        className="action-button fa fa-bars drag-handle"
        draggable="true"
      />
    )}
  </span>

Actions.propTypes = {
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  updateItemObjects: T.func.isRequired
}

let ItemObjectThumbnail = props => {
  return props.connectDragPreview(
    props.connectDropTarget(
      <span
        className={classes('item-object-thumbnail', {'active': props.active})}
        onClick={() => props.onClick(props.id, props.object.type)}
        style={{opacity: props.isDragging ? 0 : 1}}
      >
        <Actions {...props}/>
        <span className="item-object-thumbnail-content">
          <span className={classes('item-object-thumbnail-icon', getContentDefinition(props.object.type).altIcon)}></span>
          {props.object.title &&
            <span className="item-object-thumbnail-title">
              {props.object.title.substr(0, 60)}
            </span>
          }
        </span>
      </span>
    )
  )
}

ItemObjectThumbnail.propTypes = {
  id: T.string.isRequired,
  index: T.number.isRequired,
  itemId: T.string.isRequired,
  object: T.shape({
    id: T.string.isRequired,
    type: T.string.isRequired,
    url: T.string,
    data: T.string,
    title: T.string
  }).isRequired,
  active: T.bool.isRequired,
  showModal: T.func.isRequired,
  onSort: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  updateItemObjects: T.func.isRequired
}

ItemObjectThumbnail = makeSortable(ItemObjectThumbnail, 'ITEM_OBJECT_THUMBNAIL')

class ObjectsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentObject: ''
    }
  }

  selectObject(objectId) {
    const value = this.state.currentObject === objectId ? '' : objectId
    this.setState({
      currentObject: value
    })
  }

  render() {
    return (
      <div className="item-object-thumbnail-box">
        {this.props.item.objects.map((object, index) =>
          <ItemObjectThumbnail
            id={object.id}
            key={`item-object-${object.id}`}
            index={index}
            active={this.state.currentObject === object.id}
            object={object}
            itemId={this.props.item.id}
            showModal={this.props.showModal}
            updateItemObjects={this.props.updateItemObjects}
            onSort={(source, destination) => {
              this.props.updateItemObjects(this.props.item.id, OBJECT_MOVE, {id: source, swapId: destination})
            }}
            onClick={(id, type) => {console.log(`Display ${id} of type ${type}`)}}
          />
        )}
        <button
          type="button"
          className="btn btn-default"
          onClick={() =>
            this.props.showModal(MODAL_ADD_CONTENT, {
              title: tex('add_content'),
              handleSelect: (type) => {
                this.props.closeModal()
                return this.props.createItemObject(this.props.item.id, type)
              },
              handleFileUpload: (objectId, file) => {
                this.props.saveItemObjectFile(this.props.item.id, objectId, file)
                return this.props.closeModal()
              }
            })
          }

        >
          <span className="fa fa-plus"/>
          {tex('add_object')}
        </button>
      </div>
    )
  }
}

ObjectsEditor.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    objects: T.arrayOf(T.shape({
      id: T.string.isRequired,
      type: T.string.isRequired,
      url: T.string,
      data: T.string,
      title: T.string
    }))
  }).isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired
}

function mapStateToProps() {
  return {}
}

ObjectsEditor = connect(mapStateToProps, actions)(ObjectsEditor)

export {ObjectsEditor}
