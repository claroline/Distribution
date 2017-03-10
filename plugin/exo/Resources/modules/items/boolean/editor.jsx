import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import classes from 'classnames'
import {tex} from './../../utils/translate'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {Textarea} from './../../components/form/textarea.jsx'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {actions, pairs} from './editor'
import {actions as mainActions} from './../../quiz/editor/actions'

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
          'choice',
          this.props.choice._score > 0 ? 'positive-score' : 'negative-score'
        )}>
        <div className="text-fields">
          <Textarea
            id={`choice-${this.props.choice.id}-data`}
            content={this.props.choice.data}
            onChange={data => this.props.onChange(
              actions.updateChoice(this.props.choice.id, 'data', data)
            )}
          />
          {this.state.showFeedback &&
            <div className="feedback-container">
              <Textarea
                id={`choice-${this.props.choice.id}-feedback`}
                content={this.props.choice._feedback}
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
          <TooltipButton
            id={`choice-${this.props.choice.id}-feedback-toggle`}
            className="fa fa-comments-o"
            title={tex('choice_feedback_info')}
            onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
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

class Boolean extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: undefined
    }
  }

  render() {
    return (
      <div className="boolean-editor">
        <div className="dropdown">
          <button className="btn btn-default dropdown-toggle" type="button" id={`choice-drop-down-${this.props.id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            {tex('boolean_pair_select_empty')}&nbsp;
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" aria-labelledby={`choice-drop-down-${this.props.id}`}>
            {pairs.map((pair, index) =>
              <li key={`pair-${index}`}
                onClick={() => this.props.onChange(
                actions.updateChoices(pair)
              )}>
                <span className="dropdown-item">{`${pair.labelA} / ${pair.labelB}`}</span>
              </li>
            )}
          </ul>
        </div>
        <hr/>
        {get(this.props.item, '_errors.choices') &&
          <ErrorBlock text={this.props.item._errors.choices} warnOnly={!this.props.validating}/>
        }
        <div className="choices-container">
          {this.props.item.choices.map(choice =>
            <Item key={choice.id} choice={choice} onChange={this.props.onChange}/>
          )}
        </div>
      </div>
    )
  }
}

Boolean.propTypes = {
  item: T.shape({
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

export {Boolean}
