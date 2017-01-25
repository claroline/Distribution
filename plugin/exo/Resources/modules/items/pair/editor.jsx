import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import classes from 'classnames'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex, t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {makeDraggable, makeDroppable} from './../../utils/dragAndDrop'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {actions} from './editor'
import {utils} from './utils/utils'


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

const Pair = props => {

  return (
    <div className="pair">
      <DropBox object={{}} onDrop={props.onDrop} />
      <DropBox object={{}} onDrop={props.onDrop} />
    </div>
  )
}

Pair.propTypes = {
  onChange: T.func.isRequired,
  pair: T.object.isRequired,
  onDrop: T.func.isRequired
}


class PairList extends Component {

  constructor(props) {
    super(props)
  }

  /**
   * handle item drop
   * @var {source} dropped item (item)
   * @var {target} target item (set)
   */
  onItemDrop(source, target){
    // add solution (check the item is not already inside before adding it)
    /*if(undefined === this.props.solutions.associations.find(el => el.setId === target.object.id && el.itemId === source.item.id)){
      this.props.onChange(actions.addAssociation(target.object.id, source.item.id, source.item.data))
    }*/
  }

  render(){
    return (
      <div className="sets">
        <ul>
          {utils.getRealSolutionList(this.props.items, this.props.solutions).map((pair, index) =>
            <li key={`pair-${index}`}>
              <Pair
                pair={pair}
                onDrop={(source, target) => this.onItemDrop(source, target)}
                onChange={this.props.onChange}
              />
            </li>
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

PairList.propTypes = {
  onChange: T.func.isRequired,
  items: T.arrayOf(T.object).isRequired,
  solutions: T.arrayOf(T.object).isRequired
}

class Odd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showFeedback: false
    }
  }

  render(){
    return (
      <div className={classes('item', {'positive-score' : this.props.solution.score > 0}, {'negative-score': this.props.solution.score < 1})}>
        <div className="text-fields">
          <Textarea
            onChange={(value) => this.props.onChange(
              actions.updateItem(this.props.odd.id, 'data', value, true)
            )}
            id={`odd-${this.props.odd.id}-data`}
            content={this.props.odd.data}
          />
          {this.state.showFeedback &&
            <div className="feedback-container">
              <Textarea
                onChange={ (value) => this.props.onChange(
                  actions.updateItem(this.props.odd.id, 'feedback', value, true)
                )}
                id={`odd-${this.props.odd.id}-feedback`}
                content={this.props.solution.feedback}
              />
            </div>
          }
        </div>
        <div className="right-controls">
          <input
            title={tex('score')}
            type="number"
            max="0"
            className="form-control odd-score"
            value={this.props.solution.score}
            onChange={e => this.props.onChange(
              actions.updateItem(this.props.odd.id, 'score', e.target.value, true)
            )}
          />
          <TooltipButton
            id={`odd-${this.props.odd.id}-feedback-toggle`}
            className="fa fa-comments-o"
            title={tex('feedback')}
            onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
          />
          <TooltipButton
            id={`odd-${this.props.odd.id}-delete`}
            className="fa fa-trash-o"
            title={t('delete')}
            onClick={() => this.props.onChange(actions.removeItem(this.props.odd.id, true))}
          />
        </div>
      </div>
    )
  }
}

Odd.propTypes = {
  onChange: T.func.isRequired,
  odd: T.object.isRequired,
  solution: T.object.isRequired
}

const OddList= props => {

  return (
    <div className="odd-list">
      <ul>
        { utils.getOddlist(props.items, props.solutions).map((oddItem) =>
          <li key={oddItem.id}>
            <Odd onChange={props.onChange} odd={oddItem} solution={{}}/>
          </li>
        )}
      </ul>
      <div className="footer text-center">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => props.onChange(actions.addItem(true))}
        >
          <span className="fa fa-plus"/>
          {tex('set_add_odd')}
        </button>
      </div>
    </div>
  )
}

OddList.propTypes = {
  onChange: T.func.isRequired,
  items: T.arrayOf(T.object).isRequired,
  solutions: T.object.isRequired
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
        <TooltipButton
          id={`set-item-${props.item.id}-delete`}
          className="fa fa-trash-o"
          title={t('delete')}
          enabled={props.item._deletable}
          onClick={() => props.onChange(
             actions.removeItem(props.item.id, false)
          )}
        />
        {props.connectDragSource(
          <div>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`item-${props.item.id}-drag`}>{t('move')}</Tooltip>
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

const ItemList = props => {
  return (
    <div className="item-list">
      <ul>
        { utils.getRealItemlist(props.items, props.solutions).map((item) =>
          <li key={item.id}>
            <Item onChange={props.onChange} item={item}/>
          </li>
        )}
      </ul>
      <div className="footer text-center">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => props.onChange(actions.addItem(false))}
        >
          <span className="fa fa-plus"/>
          {tex('set_add_item')}
        </button>
      </div>
    </div>
  )
}

ItemList.propTypes = {
  items:  T.arrayOf(T.object).isRequired,
  onChange: T.func.isRequired,
  solutions: T.object.isRequired
}

const PairForm = (props) => {
  return(
    <div className="pair-editor">
      {get(props.item, '_errors.item') &&
        <ErrorBlock text={props.item._errors.item} warnOnly={!props.validating}/>
      }
      {get(props.item, '_errors.items') &&
        <ErrorBlock text={props.item._errors.items} warnOnly={!props.validating}/>
      }
      {get(props.item, '_errors.solutions') &&
        <ErrorBlock text={props.item._errors.solutions} warnOnly={!props.validating}/>
      }
      {get(props.item, '_errors.odd') &&
        <ErrorBlock text={props.item._errors.odd} warnOnly={!props.validating}/>
      }
      <div className="form-group">
        <label htmlFor="pair-penalty">{tex('pair_penalty_label')}</label>
        <input
          id="pair-penalty"
          className="form-control"
          value={props.item.penalty}
          type="number"
          min="0"
          onChange={e => props.onChange(
             actions.updateProperty('penalty', e.target.value)
          )}
        />
      </div>
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            checked={props.item.random}
            onChange={e => props.onChange(
              actions.updateProperty('random', e.target.checked)
            )}
          />
        {tex('set_shuffle_labels_and_proposals')}
        </label>
      </div>
      <hr/>
      <div className="pair-builder-container">
        <div className="items-col">
          <ItemList onChange={props.onChange} solutions={props.item.solutions} items={props.item.items}/>
          <hr/>
          <OddList onChange={props.onChange} solutions={props.item.solutions} items={props.item.items}/>
        </div>
        <div className="pairs-col">
          <PairList solutions={props.item.solutions} items={props.item.items} onChange={props.onChange}/>
        </div>
      </div>
    </div>
  )
}

PairForm.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    random: T.bool.isRequired,
    penalty: T.number.isRequired,
    items: T.arrayOf(T.object).isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

export {PairForm}
