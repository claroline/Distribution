import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import classes from 'classnames'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex, t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {makeDraggable, makeDroppable} from './../../utils/dragAndDrop'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {actions} from './editor'




const PairForm = (props) => {
  return(
    <div className="set-question-container">
      {get(this.props.item, '_errors.item') &&
        <div className="error-text">
          <span className="fa fa-warning"></span>
          {this.props.item._errors.item}
        </div>
      }
      {get(this.props.item, '_errors.items') &&
        <div className="error-text">
          <span className="fa fa-warning"></span>
          {this.props.item._errors.items}
        </div>
      }
      {get(this.props.item, '_errors.sets') &&
        <div className="error-text">
          <span className="fa fa-warning"></span>
          {this.props.item._errors.sets}
        </div>
      }
      {get(this.props.item, '_errors.solutions') &&
        <div className="error-text">
          <span className="fa fa-warning"></span>
          {this.props.item._errors.solutions}
        </div>
      }
      {get(this.props.item, '_errors.odd') &&
        <div className="error-text">
          <span className="fa fa-warning"></span>
          {this.props.item._errors.odd}
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
        <div className="pool-col">
          <ItemList onChange={this.props.onChange} solutions={this.props.item.solutions} items={this.props.item.items} />
          <hr/>
          <OddList onChange={this.props.onChange} solutions={this.props.item.solutions} odd={this.props.item.items} />
        </div>
        <div className="sets-col">
          <SetList solutions={this.props.item.solutions} onChange={this.props.onChange} sets={this.props.item.sets} />
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
    left: T.arrayOf(T.object).isRequired,
    right: T.arrayOf(T.object).isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export {PairForm}
