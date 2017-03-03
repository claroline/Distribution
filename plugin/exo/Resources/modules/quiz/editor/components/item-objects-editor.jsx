import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {makeSortable} from './../../../utils/sortable'
import {tex, t} from './../../../utils/translate'
import {MODAL_DELETE_CONFIRM} from './../../../modal'
import {MODAL_ADD_CONTENT} from './../components/add-content-modal.jsx'
import {actions, OBJECT_CHANGE, OBJECT_MOVE, OBJECT_REMOVE} from './../actions.js'
import {connect} from 'react-redux'
import {getContentDefinition} from './../../../contents/content-types'
import {ValidationStatus} from './validation-status.jsx'

const Actions = props =>
  <span className="object-actions">
    {getContentDefinition(props.object.type).type === 'text' &&
      <span
        role="button"
        title={tex('edit_object')}
        className="action-button fa fa-pencil"
        onClick={e => {
          e.stopPropagation()
          props.selectObject(props.id)
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
          handleConfirm: () => {
            props.selectObject('')
            props.handleRemove(props.id)
          }
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
  id: T.string.isRequired,
  itemId: T.string.isRequired,
  object: T.shape({
    id: T.string.isRequired,
    type: T.string.isRequired,
    url: T.string,
    data: T.string,
    _errors: T.object
  }).isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  handleRemove: T.func.isRequired,
  selectObject: T.func.isRequired
}

let ItemObjectThumbnail = props => {
  return props.connectDragPreview(
    props.connectDropTarget(
      <span
        className={classes('item-object-thumbnail', {'active': props.active})}
        onClick={() => props.onClick(props.id)}
        style={{opacity: props.isDragging ? 0 : 1}}
      >
        <span>
          {props.hasErrors &&
            <ValidationStatus
              id={`object-${props.id}-thumb-tip`}
              validating={props.validating}
            />
          }
          <Actions {...props}/>
        </span>
        <span className="item-object-thumbnail-content">
          <span className={classes('item-object-thumbnail-icon', getContentDefinition(props.object.type).altIcon)}></span>
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
    _errors: T.object
  }).isRequired,
  active: T.bool.isRequired,
  validating: T.bool.isRequired,
  hasErrors: T.bool,
  showModal: T.func.isRequired,
  onSort: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  handleRemove: T.func.isRequired
}

ItemObjectThumbnail = makeSortable(ItemObjectThumbnail, 'ITEM_OBJECT_THUMBNAIL')

class ObjectsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentObjectId: ''
    }
  }

  selectObject(objectId) {
    const value = this.state.currentObjectId === objectId ? '' : objectId
    this.setState({
      currentObjectId: value
    })
  }

  displayObject(objectId) {
    const object = this.props.item.objects.find(o => o.id === objectId)
    console.log(object)
  }

  hasErrors(objectId) {
    const object = this.props.item.objects.find(o => o.id === objectId)

    return object && object._errors && Object.keys(object._errors).length > 0
  }

  render() {
    return (
      <div>
        <div className="item-object-thumbnail-box">
          {this.props.item.objects.map((object, index) =>
            <ItemObjectThumbnail
              id={object.id}
              key={`item-object-${object.id}`}
              index={index}
              active={this.state.currentObjectId === object.id}
              object={object}
              validating={this.props.validating}
              hasErrors={this.hasErrors(object.id)}
              itemId={this.props.item.id}
              showModal={this.props.showModal}
              handleRemove={(objectId) => {
                this.props.updateItemObjects(this.props.item.id, OBJECT_REMOVE, {id: objectId})
                this.props.updateItem(this.props.item.id, '_errors', {})
              }}
              onSort={(source, destination) => {
                this.props.updateItemObjects(this.props.item.id, OBJECT_MOVE, {id: source, swapId: destination})
              }}
              selectObject={objectId => this.selectObject(objectId)}
              onClick={(id) => this.displayObject(id)}
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
                  const itemObject = this.props.createItemObject(this.props.item.id, type)
                  this.props.updateItem(this.props.item.id, '_errors', {})
                  const selectId = getContentDefinition(type).type === 'text' ? itemObject.id : ''
                  this.selectObject(selectId)
                  return itemObject
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
        {this.state.currentObjectId && this.props.item.objects.find(o => o.id === this.state.currentObjectId) &&
          React.createElement(
            getContentDefinition(this.props.item.objects.find(o => o.id === this.state.currentObjectId).type).editor.objectEditor,
            {
              object: this.props.item.objects.find(o => o.id === this.state.currentObjectId),
              validating: this.props.validating,
              onChange: content => {
                this.props.updateItemObjects(
                  this.props.item.id,
                  OBJECT_CHANGE,
                  {id: this.state.currentObjectId, property: 'data', value: content}
                )
                this.props.updateItem(this.props.item.id, '_errors', {})
              }
            }
          )
        }
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
      _errors: T.object
    })).isRequired
  }).isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  createItemObject: T.func.isRequired,
  updateItemObjects: T.func.isRequired,
  saveItemObjectFile: T.func.isRequired,
  validating: T.bool.isRequired
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps, actions)(ObjectsEditor)