import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex, t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {makeDraggable, makeDroppable} from './../../utils/dragAndDrop'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {actions} from './editor'

let DropBox = props => {
  return props.connectDropTarget (
     <div className={classes(
       'set-item-drop-container',
       {'on-hover': props.isOver}
     )}>
       {tex('set_drop_item')}
     </div>
   )
}

DropBox.propTypes = {
  connectDropTarget: T.func.isRequired,
  isOver: T.bool.isRequired,
  onDrop: T.func.isRequired,
  canDrop: T.bool.isRequired,
  object: T.object.isRequired
}

DropBox = makeDroppable(DropBox, 'ITEM')

class Association extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFeedback: false
    }
  }

  render() {
    return (
      <div className={classes('association', {'positive-score' : this.props.association.score > 0}, {'negative-score': this.props.association.score < 1})}>
        <div className="first-row">
          <div className="association-data" dangerouslySetInnerHTML={{__html: this.props.association._itemData}} />
          <div className="right-controls">
            <TooltipButton
              id={`ass-${this.props.association.itemId}-${this.props.association.setId}-delete`}
              className="fa fa-trash-o"
              title={t('delete')}
              onClick={() => this.props.onChange(
                actions.removeAssociation(this.props.association.setId, this.props.association.itemId))
              }
            />
          </div>
        </div>
      </div>
    )
  }
}

Association.propTypes = {
  onChange: T.func.isRequired,
  association: T.object.isRequired
}

class Set extends Component {

  constructor(props) {
    super(props)
  }

  render(){
    return (
        <div className="set">
          <div className="set-heading">
            <div className="text-fields">
              <Textarea
                onChange={(value) => this.props.onChange(
                  actions.updateSet(this.props.set.id, 'data', value)
                )}
                id={`${this.props.set.id}-data`}
                content={this.props.set.data}
              />
            </div>
            <div className="right-controls">
              <TooltipButton
                id={`set-${this.props.set.id}-delete`}
                className="fa fa-trash-o"
                title={t('delete')}
                enabled={this.props.set._deletable}
                onClick={() => this.props.onChange(
                  actions.removeSet(this.props.set.id))
                }
              />
            </div>
          </div>
          <div className="set-body">
            <ul>
            { this.props.associations.map(ass =>
              <li key={`${ass.itemId}-${ass.setId}`}>
                <Association association={ass} onChange={this.props.onChange}/>
              </li>
            )}
            </ul>
            <DropBox object={this.props.set} onDrop={this.props.onDrop} />
          </div>
        </div>
    )
  }
}

Set.propTypes = {
  onChange: T.func.isRequired,
  set: T.object.isRequired,
  onDrop: T.func.isRequired,
  associations: T.arrayOf(T.object).isRequired
}

class SetList extends Component {

  constructor(props) {
    super(props)
  }

  /**
   * handle item drop
   * @var {source} dropped item (item)
   * @var {target} target item (set)
   */
  onItemDrop(source, target){
    // @TODO add solution (check the item is not already inside before adding it)
    if(undefined === this.props.solutions.associations.find(el => el.setId === target.object.id && el.itemId === source.item.id)){
      this.props.onChange(actions.addAssociation(target.object.id, source.item.id, source.item.data))
    }
  }

  render(){
    return (
      <div className="sets">
        <ul>
          {this.props.sets.map((set) =>
            <li key={`set-id-${set.id}`}>
              <Set
                associations={
                  this.props.solutions.associations.filter(association => association.setId === set.id) || []
                }
                onDrop={
                  (source, target) => this.onItemDrop(source, target)
                }
                onChange={this.props.onChange}
                set={set}
              />
            </li>
          )}
        </ul>
      </div>
    )
  }
}

SetList.propTypes = {
  onChange: T.func.isRequired,
  sets: T.arrayOf(T.object).isRequired,
  solutions: T.shape({
    associations: T.arrayOf(T.object).isRequired,
    odds: T.arrayOf(T.object)
  }).isRequired
}

let Item = props => {
  return props.connectDragPreview (
    <div className="item">
      <div className="text-fields">
        <Textarea
          onChange={(value) => props.onChange(
            actions.updateItem(props.item.id, 'data', value, false)
          )}
          id={`${props.item.id}-data`}
          content={props.item.data}
        />
      </div>
      <div className="right-controls">
        {props.connectDragSource(
          <div>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`set-item-${props.item.id}-drag`}>{t('move')}</Tooltip>
              }>
              <span
                title={t('move')}
                draggable="true"
                className={classes(
                  'tooltiped-button',
                  'btn',
                  'fa',
                  'fa-bars',
                  'drag-handle'
                )}
              />
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  )
}

Item.propTypes = {
  onChange: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  item: T.object.isRequired
}

Item = makeDraggable(Item, 'ITEM')

const ItemList = props =>
  <div className="item-list">
    <ul>
      { props.items.map((item) =>
        <li key={item.id}>
          <Item onChange={props.onChange} item={item}/>
        </li>
      )}
    </ul>
  </div>


ItemList.propTypes = {
  items:  T.arrayOf(T.object).isRequired,
  onChange: T.func.isRequired,
  solutions: T.object.isRequired
}

const SetPlayer = props =>
  <div className="set-question-player">
      <div className="items-col">
        <ItemList onChange={props.onChange} items={props.item.items} />
      </div>
      <div className="sets-col">
        <SetList onChange={this.props.onChange} sets={props.item.sets} />
      </div>
  </div>

SetPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    random: T.bool.isRequired,
    penalty: T.number.isRequired,
    sets: T.arrayOf(T.object).isRequired,
    items: T.arrayOf(T.object).isRequired
  }).isRequired,
  answer: T.bool.isRequired,
  onChange: T.func.isRequired
}

export {SetPlayer}
