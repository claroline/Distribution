import React, {Component, PropTypes as T} from 'react'
import {tex, t} from './../lib/translate'
import classes from 'classnames'
import {Textarea} from './../components/form/textarea.jsx'
import {actions} from './set.js'
import get from 'lodash/get'
import {makeDraggable, makeDroppable} from './../lib/dragAndDrop'



let DropBox = props => {
  return props.connectDropTarget (
     <div className={classes(
       'set-item-drop-container',
       {'on-hover': props.isOver}
     )}>
       {tex('DROP ITEM HERE')}
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

DropBox =  makeDroppable(DropBox, 'ITEM')

class Set extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showFeedback: false
    }
  }

  render(){
    return (
      <li>
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <span className="btn-group pull-right">
              <a
                role="button"
                title={t('delete')}
                className={
                  classes(
                    'fa',
                    'fa-trash-o',
                    {disabled: !this.props.set._deletable}
                  )
                }>
              </a>
            </span>
            <input
              className="form-control input-control-sm"
              value={this.props.set.id}
              type="text"
              onChange={() => {}} />
          </div>
          <div className="panel-body">
            <ul>
            { this.props.associations.map(ass =>
              <li key={`${ass.itemId}-${ass.setId}`}>
                <div className="text-fields">
                  <div className="association-data-container">
                    {ass._itemData}
                  </div>
                  {this.state.showFeedback &&
                    <Textarea
                      onChange={ (value) => this.props.onChange(
                        actions.updateAssociation(ass.setId, ass.itemId, 'feedback', value)
                      )}
                      id={`${ass.itemId}-${ass.setId}-feedback`}
                      content={ass.feedback}
                    />
                  }
                </div>
                <div className="right-controls">
                  <input
                    title={tex('score')}
                    type="number"
                    className="form-control association-score"
                    value={ass.score}
                    onChange={e => this.props.onChange(
                      actions.updateAssociation(ass.setId, ass.itemId, 'score', e.target.value)
                    )}
                  />
                  <a
                    role="button"
                    title={tex('feedback')}
                    className="fa fa-comments-o"
                    onClick={() => this.setState({showFeedback: !this.state.showFeedback})}>
                  </a>
                  <a
                    role="button"
                    title={t('delete')}
                    className="btn btn-link fa fa-trash-o"
                    onClick={() => this.props.onChange(actions.removeAssociation(ass.setId, ass.itemId))}>
                  </a>
                </div>
              </li>
            )}
            </ul>
            <DropBox object={this.props.set} onDrop={this.props.onDrop} />

          </div>
        </div>
      </li>
    )
  }

}

Set.propTypes = {
  onChange: T.func.isRequired,
  set: T.object.isRequired,
  onDrop: T.func.isRequired,
  associations: T.arrayOf(T.object).isRequired
}



/*
let Set = props => {
  return (
    <li>
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
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
        <div className="panel-body">
          <ul>
          { props.associations.map(ass =>
            <li key={`${ass.itemId}-${ass.setId}`}>
              <div className="text-fields">
                <div className="association-data-container">
                  {ass._itemData}
                </div>
                {this.state.showFeedback &&
                  <Textarea
                    onChange={ (value) => props.onChange(
                      actions.updateAssociation(ass.setId, ass.itemId, 'feedback', value)
                    )}
                    id={`${ass.itemId}-${ass.setId}-feedback`}
                    content={ass.feedback}
                  />
                }
              </div>
              <div className="right-controls">
                <input
                  title={tex('score')}
                  type="number"
                  className="form-control association-score"
                  value={ass.score}
                  onChange={e => props.onChange(
                    actions.updateAssociation(ass.setId, ass.itemId, 'score', e.target.value)
                  )}
                />
                <a
                  role="button"
                  title={tex('feedback')}
                  className="fa fa-comments-o"
                  onClick={() => this.setState({showFeedback: !this.state.showFeedback})}>
                </a>
                <a
                  role="button"
                  title={t('delete')}
                  className="btn btn-link fa fa-trash-o"
                  onClick={() => props.onChange(actions.removeAssociation(ass.setId, ass.itemId))}>
                </a>
              </div>
            </li>
          )}
          </ul>
           {props.connectDropTarget (
            <div className={classes(
              'set-item-drop-container',
              {'on-hover': props.isOver}
            )}>
              {tex('DROP ITEM HERE')}
            </div>
          )}

        </div>
      </div>
    </li>
  )
}

Set.propTypes = {
  onChange: T.func.isRequired,
  set: T.object.isRequired,
  connectDropTarget: T.func.isRequired,
  isOver: T.bool.isRequired,
  canDrop: T.bool.isRequired,
  onDrop: T.func.isRequired,
  associations: T.arrayOf(T.object).isRequired
}

Set = makeDroppable(Set, 'ITEM')*/



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
    console.log(target)
    // @TODO add solution (check the item is not already inside before adding it)
    if(undefined === this.props.solutions.associations.find(el => el.setId === target.set.id && el.itemId === source.item.id)){
      this.props.onChange(actions.addAssociation(target.object.id, source.item.id, source.item.data))
    }
  }

  render(){
    return (
      <div className="sets">
        <ul>
          {this.props.sets.map((set) =>
            <Set
              key={`set-id-${set.id}`}
              associations={
                this.props.solutions.associations.filter(association => association.setId === set.id) || []
              }
              onDrop={
                (source, target) => this.onItemDrop(source, target)
              }
              onChange={this.props.onChange}
              set={set}
            />
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
  sets: T.arrayOf(T.object).isRequired,
  solutions: T.shape({
    associations: T.arrayOf(T.object).isRequired,
    odds: T.arrayOf(T.object)
  }).isRequired
}

let Item = props => {
  return props.connectDragPreview (
    <li>
      <div className="text-fields">
        <Textarea
          onChange={ (value) => props.onChange(
            actions.updateItem(props.item.id, 'data', value)
          )}
          id={`${props.item.id}-data`}
          content={props.item.data}
        />
      </div>
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
          onClick={() => actions.removeItem(props.item.id)}
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
            <SetList solutions={this.props.item.solutions} onChange={this.props.onChange} sets={this.props.item.sets} />
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
      associations: T.arrayOf(T.object).isRequired,
      odds: T.arrayOf(T.object)
    }).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export {SetForm}
