import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import classes from 'classnames'

import {tex} from '#/main/app/intl/translation'
import {ContentError} from '#/main/app/content/components/error'
import {Textarea} from '#/main/core/layout/form/components/field/textarea'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {actions} from './editor'
import {utils} from './utils/utils'

class Item extends Component {
  constructor(props){
    super(props)
    this.state = {
      showFeedback: false
    }
  }

  render(){
    return(
      <div className={classes(
        'answer-item choice-item',
        this.props.choice._score > 0 ? 'expected-answer' : 'unexpected-answer'
      )}>
        <div className="text-fields">
          <Textarea
            id={`choice-${this.props.choice.id}-data`}
            value={this.props.choice.data}
            onChange={data => this.props.onChange(
              actions.updateChoice(this.props.choice.id, 'data', data)
            )}
          />
          {this.state.showFeedback &&
            <div className="feedback-container">
              <Textarea
                id={`choice-${this.props.choice.id}-feedback`}
                value={this.props.choice._feedback}
                onChange={text => this.props.onChange(
                  actions.updateChoice(this.props.choice.id, 'feedback', text)
                )}
              />
            </div>
          }
        </div>
        <div className="right-controls">
          <input
            title={tex('score')}
            type="number"
            className="form-control choice-score"
            value={this.props.choice._score}
            onChange={e => this.props.onChange(
              actions.updateChoice(this.props.choice.id, 'score', e.target.value)
            )}
          />

          <Button
            id={`choice-${this.props.choice.id}-feedback-toggle`}
            className="btn-link"
            type={CALLBACK_BUTTON}
            icon="fa fa-fw fa-comments-o"
            label={tex('choice_feedback_info')}
            callback={() => this.setState({showFeedback: !this.state.showFeedback})}
          />
        </div>
      </div>
    )
  }
}

Item.propTypes = {
  choice: T.shape({
    id: T.string.isRequired,
    data: T.string.isRequired,
    _feedback: T.string,
    _score: T.number.isRequired
  }).isRequired,
  onChange: T.func.isRequired
}

const Boolean = props => {
  return (
    <div className="boolean-editor">
      <div className="form-group dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id={`choice-drop-down-${props.item.id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {tex('boolean_pair_select_empty')}&nbsp;
          <span className="caret" />
        </button>
        <ul className="dropdown-menu" aria-labelledby={`choice-drop-down-${props.item.id}`}>
          {utils.getDefaultPairs().map((pair, index) =>
            <li
              key={`pair-${index}`}
              onClick={() => props.onChange(
                actions.updateChoices(pair)
              )}
            >
              <a role="menuitem">{`${pair.labelA} / ${pair.labelB}`}</a>
            </li>
          )}
        </ul>
      </div>

      {get(props.item, '_errors.choices') &&
        <ContentError error={props.item._errors.choices} warnOnly={!props.validating} />
      }

      <div className="row">
        {props.item.choices.map(choice =>
          <div key={choice.id} className="col-md-6">
            <Item choice={choice} onChange={props.onChange}/>
          </div>
        )}
      </div>
    </div>
  )
}

Boolean.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired,
      _feedback: T.string,
      _score: T.number.isRequired
    })).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}

export {
  Boolean
}