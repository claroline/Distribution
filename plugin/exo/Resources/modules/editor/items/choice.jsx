import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Field, FieldArray, Fields, change} from 'redux-form'
import classes from 'classnames'
import {t, tex} from './../lib/translate'
import {ITEM_FORM} from './../components/item-form.jsx'
import Controls from './../components/form-controls.jsx'
import {
  makeNewChoice,
  choiceDeletablesSelector,
  choiceTicksSelector
} from './choice'

const T = React.PropTypes

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div>
        <div className="choice-tick">
          <input
            disabled={!this.props.fixedScore}
            name={`${this.props.name}.tick`}
            type={this.props.multiple ? 'checkbox' : 'radio'}
            checked={this.props.checked}
            readOnly={!this.props.fixedScore}
            onChange={(e) =>
              this.props.changeFieldValue(
              `${this.props.name}.score`,
              e.target.checked ? 1 : 0
            )}
          />
        </div>
        <div className="text-fields">
          <Field
            id={`${this.props.name}.data`}
            name={`${this.props.name}.data`}
            title={tex('response')}
            component={Controls.Textarea}
          />
        {this.state.showFeedback &&
          <div className="feedback-container">
            <Field
              id={`${this.props.name}.feedback`}
              component={Controls.Textarea}
              name={`${this.props.name}.feedback`}
              title={tex('feedback')}
            />
          </div>
        }
        </div>
        <div className="right-controls">
            {!this.props.fixedScore &&
              <Field
                name={`${this.props.name}.score`}
                title={tex('score')}
                component="input"
                type="number"
                className="form-control choice-score"
              />
            }
            <span
              role="button"
              aria-disabled={!this.props.deletable}
              title={t('delete')}
              className={classes('fa', 'fa-trash-o', {disabled: !this.props.deletable})}
              onClick={() => this.props.deletable && this.props.onRemove()}
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
  name: T.string.isRequired,
  multiple: T.bool.isRequired,
  fixedScore: T.bool.isRequired,
  checked: T.bool.isRequired,
  deletable: T.bool.isRequired,
  onRemove: T.func.isRequired,
  changeFieldValue: T.func.isRequired
}

const ChoiceItems = props =>
  <div>
    {props.meta.error &&
      <Controls.ErrorText error={props.meta.error}/>
    }
    <ul className="choice-items">
      {props.fields.map((choice, index) =>
        <li key={choice}>
          <ChoiceItem
            name={choice}
            multiple={props.multiple}
            fixedScore={props.fixedScore}
            checked={props.choiceTicks[index]}
            deletable={props.choiceDeletables[index]}
            changeFieldValue={props.changeFieldValue}
            onRemove={() => {props.fields.remove(index)}}
          />
        </li>
      )}
      <div className="footer">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => props.fields.push(makeNewChoice())}
        >
          <span className="fa fa-plus"/>
          &nbsp;{tex('add_choice')}
        </button>
      </div>
    </ul>
  </div>

ChoiceItems.propTypes = {
  fields: T.object.isRequired,
  choiceDeletables: T.arrayOf(T.bool).isRequired,
  choiceTicks: T.arrayOf(T.bool).isRequired,
  multiple: T.bool.isRequired,
  fixedScore: T.bool.isRequired,
  changeFieldValue: T.func.isRequired,
  meta: T.shape({
    error: T.string
  }).isRequired
}

const ChoiceForm = props =>
  <fieldset>
    <Field
      name="multiple"
      component={Controls.SingleCheck}
      label={tex('Multiple responses')}
    />
    <Field
      name="random"
      component={Controls.SingleCheck}
      label={tex('qcm_shuffle')}
    />
    <Field
      name="fixedScore"
      component={Controls.SingleCheck}
      label={tex('fixed_score')}
    />
    {props.fixedScore.input.value === true &&
      <div className="sub-fields">
        <Field
          name="fixedSuccess"
          component={Controls.Number}
          min={0}
          label={tex('fixed_score_on_success')}
        />
        <Field
          name="fixedFailure"
          component={Controls.Number}
          label={tex('fixed_score_on_failure')}
        />
      </div>
    }
    <hr/>
    <FieldArray
      name="choices"
      component={ChoiceItems}
      choiceTicks={props.choiceTicks}
      choiceDeletables={props.choiceDeletables}
      changeFieldValue={props.changeFieldValue}
      props={{
        multiple: props.multiple.input.value,
        fixedScore: props.fixedScore.input.value
      }}
    />
  </fieldset>

ChoiceForm.propTypes = {
  choiceDeletables: T.arrayOf(T.bool).isRequired,
  choiceTicks: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired,
  fixedScore: T.shape({
    input: T.shape({
      value: T.bool.isRequired
    }).isRequired
  }).isRequired,
  multiple: T.shape({
    input: T.shape({
      value: T.bool.isRequired
    }).isRequired
  }).isRequired
}

let Choice = props =>
  <Fields
    component={ChoiceForm}
    choiceDeletables={props.choiceDeletables}
    choiceTicks={props.choiceTicks}
    changeFieldValue={props.changeFieldValue}
    names={[
      'multiple',
      'random',
      'fixedScore',
      'choices'
    ]}
  />

Choice.propTypes = {
  choiceDeletables: T.arrayOf(T.bool).isRequired,
  choiceTicks: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired
}

Choice = connect(
  state => ({
    choiceDeletables: choiceDeletablesSelector(state),
    choiceTicks: choiceTicksSelector(state)
  }),
  dispatch => ({
    changeFieldValue: (field, value) =>
      dispatch(change(ITEM_FORM, field, value))
  })
)(Choice)

export {Choice}
