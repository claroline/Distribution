import React, {Component, PropTypes as T} from 'react'
import {tex, t} from './../lib/translate'
import classes from 'classnames'
import {Textarea} from './../components/form/textarea.jsx'
import {actions} from './set.js'
import get from 'lodash/get'
import {makeDraggable, makeDroppable} from './../lib/draggable'

let SetItem = props => {
  return (
    <li>
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className="btn-group pull-right">
            <a
              role="button"
              title={t('delete')}
              className={
                classes(
                  'fa',
                  'fa-trash-o',
                  {disabled: !props.set._deletable}
                )
              }>

            </a>
          </span>
          <input
            className="form-control input-control-sm"
            value={props.set.id}
            type="text"
            onChange={() => {}} />
        </div>
        {props.connectDropTarget(
          <div className="panel-body">
          </div>
        )}
        {props.isOver && <span>HOVER</span>}
      </div>
    </li>
  )
}

SetItem.propTypes = {
  onChange: T.func.isRequired,
  set: T.object.isRequired,
  connectDropTarget: T.func.isRequired,
  isOver: T.bool.isRequired,
  canDrop: T.bool.isRequired
}

SetItem = makeDroppable(SetItem, 'SET_ITEM')

class SetList extends Component {
  constructor(props) {
    super(props)
  }

  onItemDrop(){
    console.log('drop')
  }
  render(){
    return (
      <div className="sets">
        <ul>
          {this.props.sets.map((el) =>
            <SetItem key={`set-id-${el.id}`} onChange={this.props.onChange} set={el} />
          )}
        </ul>
        <div className="footer text-center">
          <button
            type="button"
            className="btn btn-default"
            onClick={() => this.props.onChange(actions.addSet())}
          >
            <span className="fa fa-plus"/>
            {tex('set_add_set')}
          </button>
        </div>
      </div>

    )
  }
}

SetList.propTypes = {
  onChange: T.func.isRequired,
  sets: T.arrayOf(T.object).isRequired
}


let Item = props => {
  return (
      <li>
        {props.connectDragPreview (
          <div className="text-fields">
            <Textarea
              onChange={value => props.onChange(
                actions.updateItem(props.item.id, 'data', value)
              )}
              id={`${props.item.id}-data`}
              content={props.item.data}
            />
          </div>
        )}
        <div className="right-controls">
          <a
            role="button"
            title={t('delete')}
            className={classes(
              'btn',
              'btn-link',
              'fa',
              'fa-trash-o',
              {disabled: !props.item._deletable}
            )}
            onClick={() => this.actions.removeItem(props.item.id)}
          />
          {props.connectDragSource(
            <a
              role="button"
              title={t('move')}
              draggable="true"
              className={classes(
                'btn',
                'btn-link',
                'fa',
                'fa-bars',
                'drag-handle'
              )}
            />
          )}
        </div>
      </li>
    )

}

Item.propTypes = {
  onChange: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  item: T.object.isRequired
}

Item = makeDraggable(Item, 'ITEM')

class ItemList extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="item-list">
        <ul>
          {this.props.items.map((item) =>
            <Item
              key={item.id}
              onChange={this.props.onChange}
              item={item}/>
          )}
        </ul>
        <div className="footer text-center">
          <button
            type="button"
            className="btn btn-default"
            onClick={() => this.props.onChange(actions.addItem())}
          >
            <span className="fa fa-plus"/>
            {tex('set_add_item')}
          </button>
        </div>
      </div>
    )
  }
}

ItemList.propTypes = {
  items:  T.arrayOf(T.object).isRequired,
  onChange: T.func.isRequired
}

class Odd extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <h4>{this.props.odd.data}</h4>
    )
  }
}

Odd.propTypes = {
  onChange: T.func.isRequired,
  odd: T.object.isRequired
}

class OddList extends Component {

  render(){
    return (
      <div className="odds">
        <ul>
          {this.props.odds.map((odd) =>
            <li key={odd.id}>
              <Odd onChange={this.props.onChange} odd={odd} />
            </li>
          )}
        </ul>
        <div className="footer text-center">
          <button
            type="button"
            className="btn btn-default"
            onClick={() => this.props.onChange(actions.addOdd())}
          >
            <span className="fa fa-plus"/>
            {tex('set_add_odd')}
          </button>
        </div>
      </div>
    )
  }
}

OddList.propTypes = {
  onChange: T.func.isRequired,
  odds: T.arrayOf(T.object).isRequired
}

class SetForm extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="set-question-container">
        { get(this.props.item, '_touched') &&
          get(this.props.item, '_errors.items') &&
          <div className="error-text">
            <span className="fa fa-warning"></span>
            {this.props.item._errors.items}
          </div>
        }
        { get(this.props.item, '_touched') &&
          get(this.props.item, '_errors.solutions') &&
          <div className="error-text">
            <span className="fa fa-warning"></span>
            {this.props.item._errors.solutions}
          </div>
        }
        <div className="form-group">
          <label htmlFor="set-penalty">{tex('set_penalty_label')}</label>
          <input
            id="set-penalty"
            className="form-control"
            value={this.props.item.penalty}
            type="number"
            min="0"
            onChange={e => this.props.onChange(
               actions.updateProperty('penalty', e.target.value)
            )}
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.item.random}
              onChange={e => this.props.onChange(
                actions.updateProperty('random', e.target.value)
              )}
            />
          {tex('set_shuffle_labels_and_proposals')}
          </label>
        </div>
        <hr/>
        <div className="sets-builder-container">
          <div className="pool-container">
            <ItemList
              onChange={this.props.onChange}
              items={this.props.item.items} />
            <hr/>
            <OddList onChange={this.props.onChange} odds={this.props.item.solutions.odds} />
          </div>
          <div className="sets-container">
            <SetList onChange={this.props.onChange} sets={this.props.item.sets} />
          </div>
        </div>
      </div>
    )
  }
}

SetForm.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    random: T.bool.isRequired,
    penalty: T.number.isRequired,
    sets: T.arrayOf(T.object).isRequired,
    items: T.arrayOf(T.object).isRequired,
    solutions: T.shape({
      associations: T.arrayOf(T.shape({
        setId: T.string.isRequired,
        itemId:  T.string.isRequired,
        score: T.number.isRequired,
        feedback: T.string
      })).isRequired,
      odds: T.arrayOf(T.object)
    }).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export {SetForm}
