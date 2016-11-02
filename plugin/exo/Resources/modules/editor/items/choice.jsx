import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import classes from 'classnames'
import {t, tex} from './../lib/translate'
import {SCORE_SUM, SCORE_FIXED} from './../enums'
import {Textarea} from './../components/form/textarea.jsx'
import {CheckGroup} from './../components/form/check-group.jsx'
import {FormGroup} from './../components/form/form-group.jsx'
import {actions} from './choice'

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div className="choice-item">
        <div className="choice-tick">
          <input
            disabled={!this.props.fixedScore}
            type={this.props.multiple ? 'checkbox' : 'radio'}
            checked={this.props.checked}
            readOnly={!this.props.fixedScore}
            onChange={e => this.props.onChange(
              actions.updateChoice(this.props.id, 'checked', e.target.checked)
            )}
          />
        </div>
        <div className="text-fields">
          <Textarea
            id={`choice-${this.props.id}-data`}
            title={tex('response')}
            content={this.props.data}
            onChange={data => this.props.onChange(
              actions.updateChoice(this.props.id, 'data', data)
            )}
          />
          {this.state.showFeedback &&
            <div className="feedback-container">
              <Textarea
                id={`choice-${this.props.id}-feedback`}
                title={tex('feedback')}
                content={this.props.feedback}
                onChange={text => this.props.onChange(
                  actions.updateChoice(this.props.id, 'feedback', text)
                )}
              />
            </div>
          }
        </div>
        <div className="right-controls">
            {!this.props.fixedScore &&
              <input
                title={tex('score')}
                type="number"
                className="form-control choice-score"
                value={this.props.score}
                onChange={e => this.props.onChange(
                  actions.updateChoice(this.props.id, 'score', e.target.value)
                )}
              />
            }
            <span
              role="button"
              aria-disabled={!this.props.deletable}
              title={t('delete')}
              className={classes('fa', 'fa-trash-o', {disabled: !this.props.deletable})}
              onClick={() => this.props.deletable && this.props.onChange(
                actions.removeChoice(this.props.id)
              )}
            />
            <span
              role="button"
              title={tex('choice_feedback_info')}
              className="fa fa-comments-o"
              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
        </div>
      </div>
    )
  }
}

ChoiceItem.propTypes = {
  id: T.string.isRequired,
  data: T.string.isRequired,
  score: T.number.isRequired,
  feedback: T.string.isRequired,
  multiple: T.bool.isRequired,
  fixedScore: T.bool.isRequired,
  checked: T.bool.isRequired,
  deletable: T.bool.isRequired,
  onChange: T.func.isRequired
}

const ChoiceItems = props =>
  <div>
    {get(props.item, '_touched.choices') &&
      get(props.item, '_errors.choices') &&
      <div className="error-text">
        <span className="fa fa-warning"></span>
        {props.item._errors.choices}
      </div>
    }
    <ul className="choice-items">
      {props.item.choices.map(choice =>
        <li key={choice.id}>
          <ChoiceItem
            id={choice.id}
            data={choice.data}
            score={choice._score}
            feedback={choice._feedback}
            multiple={props.item.multiple}
            fixedScore={props.item.score.type === SCORE_FIXED}
            checked={choice._checked}
            deletable={choice._deletable}
            onChange={props.onChange}
          />
        </li>
      )}
      <div className="footer">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => props.onChange(actions.addChoice())}
        >
          <span className="fa fa-plus"/>
          {tex('add_choice')}
        </button>
      </div>
    </ul>
  </div>

ChoiceItems.propTypes = {
  item: T.shape({
    multiple: T.bool.isRequired,
    score: T.shape({
      type: T.string.isRequired
    }),
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired,
      _feedback: T.string,
      _checked: T.bool.isRequired,
      _deletable: T.bool.isRequired,
      _score: T.number.isRequired
    })).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export const Choice = props =>
  <fieldset>
    <CheckGroup
      checkId={`item-${props.item.id}-multiple`}
      checked={props.item.multiple}
      label={tex('Multiple responses')}
      onChange={checked => props.onChange(actions.updateProperty('multiple', checked))}
    />
    <CheckGroup
      checkId={`item-${props.item.id}-random`}
      checked={props.item.random}
      label={tex('qcm_shuffle')}
      onChange={checked => props.onChange(actions.updateProperty('random', checked))}
    />
    <CheckGroup
      checkId={`item-${props.item.id}-fixedScore`}
      checked={props.item.score.type === SCORE_FIXED}
      label={tex('fixed_score')}
      onChange={checked => props.onChange(
        actions.updateProperty('score.type', checked ? SCORE_FIXED : SCORE_SUM)
      )}
    />
    {props.item.score.type === SCORE_FIXED &&
      <div className="sub-fields">
        <FormGroup
          controlId={`item-${props.item.id}-fixedSuccess`}
          label={tex('fixed_score_on_success')}
          error={get(props.item, '_errors.score.success')}
        >
          <input
            id={`item-${props.item.id}-fixedSuccess`}
            type="number"
            min="0"
            value={props.item.score.success}
            className="form-control"
            onChange={e => props.onChange(
              actions.updateProperty('score.success', e.target.value)
            )}
          />
        </FormGroup>
        <FormGroup
          controlId={`item-${props.item.id}-fixedFailure`}
          label={tex('fixed_score_on_failure')}
          error={get(props.item, '_errors.score.failure')}
        >
          <input
            id={`item-${props.item.id}-fixedFailure`}
            type="number"
            value={props.item.score.failure}
            className="form-control"
            onChange={e => props.onChange(
              actions.updateProperty('score.failure', e.target.value)
            )}
          />
        </FormGroup>
      </div>
    }
    <hr/>
    <ChoiceItems {...props}/>
  </fieldset>

Choice.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    multiple: T.bool.isRequired,
    random: T.bool.isRequired,
    score: T.shape({
      type: T.string.isRequired,
      success: T.number.isRequired,
      failure: T.number.isRequired
    }),
    choices: T.arrayOf(T.object).isRequired
  }).isRequired,
  onChange: T.func.isRequired
}
