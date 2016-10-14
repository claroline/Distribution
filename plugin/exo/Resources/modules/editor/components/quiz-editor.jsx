import React, {Component, PropTypes as T} from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import classes from 'classnames'
import {t, tex} from './../lib/translate'
import {FormGroup} from './form/form-group.jsx'
import {CheckGroup} from './form/check-group.jsx'
import {Textarea} from './form/textarea.jsx'
import {Date} from './form/date.jsx'
import {
  quizTypes,
  correctionModes,
  markModes,
  SHOW_CORRECTION_AT_DATE
} from './../types'

const param = (property, value) => ({parameters: {[property]: value}})

const Properties = props =>
  <fieldset>
    <FormGroup controlId="quiz-type" label={t('type')}>
      <select
        id="quiz-type"
        value={props.parameters.type}
        className="form-control"
        onChange={e => props.onChange(param('type', e.target.value))}
      >
        {quizTypes.map(type =>
          <option key={type[0]} value={type[0]}>{tex(type[1])}</option>
        )}
      </select>
    </FormGroup>
    <FormGroup
      controlId="quiz-title"
      label={t('title')}
      error={props.errors.title}
    >
      <input
        id="quiz-title"
        type="text"
        value={props.title}
        className="form-control"
        onChange={e => props.onChange({title: e.target.value})}
      />
    </FormGroup>
    <FormGroup controlId="quiz-description" label={t('description')}>
      <Textarea
        id="quiz-description"
        content={props.description}
        onChange={description => props.onChange({description})}
      />
    </FormGroup>
    <CheckGroup
      checkId="quiz-show-metadata"
      checked={props.parameters.showMetadata}
      label={tex('metadata_visible')}
      help={tex('metadata_visible_help')}
      onChange={checked => props.onChange(param('showMetadata', checked))}
    />
  </fieldset>

const StepPicking = props =>
  <fieldset>
    <FormGroup
      controlId="quiz-pick"
      label={tex('number_steps_draw')}
      help={tex('number_steps_draw_help')}
      error={props.errors.parameters.pick}
    >
      <input
        id="quiz-pick"
        type="number"
        min="0"
        value={props.parameters.pick}
        className="form-control"
        onChange={e => props.onChange(param('pick', e.target.value))}
      />
    </FormGroup>
    <CheckGroup
      checkId="quiz-random"
      checked={props.parameters.random}
      label={tex('random_steps_order')}
      onChange={checked => props.onChange(param('random', checked))}
    />
  </fieldset>

const Signing = props =>
  <fieldset>
    <FormGroup
      controlId="quiz-duration"
      label={tex('duration')}
      help={tex('duration_help')}
      error={props.errors.parameters.duration}
    >
      <input
        id="quiz-duration"
        type="number"
        min="0"
        value={props.parameters.duration}
        className="form-control"
        onChange={e => props.onChange(param('duration', e.target.value))}
      />
    </FormGroup>
    <FormGroup
      controlId="quiz-maxAttempts"
      label={tex('maximum_attempts')}
      help={tex('number_max_attempts_help')}
      error={props.errors.parameters.maxAttempts}
    >
      <input
        id="quiz-maxAttempts"
        type="number"
        min="0"
        value={props.parameters.maxAttempts}
        className="form-control"
        onChange={e => props.onChange(param('maxAttempts', e.target.value))}
      />
    </FormGroup>
    <CheckGroup
      checkId="quiz-interruptible"
      checked={props.parameters.interruptible}
      label={tex('allow_test_exit')}
      onChange={checked => props.onChange(param('interruptible', checked))}
    />
</fieldset>

const Correction = props =>
  <fieldset>
    <FormGroup
      controlId="quiz-showCorrectionAt"
      label={tex('availability_of_correction')}
    >
      <select
        id="quiz-showCorrectionAt"
        value={props.parameters.showCorrectionAt}
        className="form-control"
        onChange={e => props.onChange(param('showCorrectionAt', e.target.value))}
      >
        {correctionModes.map(mode =>
          <option key={mode[0]} value={mode[0]}>{tex(mode[1])}</option>
        )}
      </select>
    </FormGroup>
    {props.parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE &&
      <div className="sub-fields">
        <FormGroup
          controlId="quiz-correctionDate"
          label={tex('correction_date')}
        >
          <Date
            id="quiz-correctionDate"
            name="quiz-correctionDate"
            value={props.parameters.correctionDate}
            onChange={date => props.onChange(param('correctionDate', date))}
          />
        </FormGroup>
      </div>
    }
    <FormGroup controlId="quiz-showScoreAt" label={tex('score_displaying')}>
      <select
        id="quiz-showScoreAt"
        value={props.parameters.showScoreAt}
        className="form-control"
        onChange={e => props.onChange(param('showScoreAt', e.target.value))}
      >
        {markModes.map(mode =>
          <option key={mode[0]} value={mode[0]}>
            {tex(mode[1])}
          </option>
        )}
      </select>
    </FormGroup>
    <CheckGroup
      checkId="quiz-anonymous"
      checked={props.parameters.anonymous}
      label={t('anonymous')}
      onChange={checked => props.onChange(param('anonymous', checked))}
    />
    <CheckGroup
      checkId="quiz-showFullCorrection"
      checked={props.parameters.showFullCorrection}
      label={tex('maximal_correction')}
      onChange={checked => props.onChange(param('showFullCorrection', checked))}
    />
    <CheckGroup
      checkId="quiz-showStatistics"
      checked={props.parameters.showStatistics}
      label={tex('statistics')}
      onChange={checked => props.onChange(param('showStatistics', checked))}
    />
  </fieldset>

function makePanel(Section, title, key, props) {
  const caretIcon = key === props.activePanelKey ?
    'fa-caret-down' :
    'fa-caret-right'

  const Header =
    <div onClick={() => props.handlePanelClick(key)}>
      <span>
        <span className={classes('panel-icon', 'fa', caretIcon)}/>
        &nbsp;{title}
      </span>
    </div>

  return (
    <Panel
      eventKey={key}
      header={Header}
    >
      <Section
        onChange={props.updateProperties}
        errors={props.quiz._errors}
        {...props.quiz}
      />
    </Panel>
  )
}

export const QuizEditor = props => {
  return (
    <form>
      <PanelGroup
        accordion
        activeKey={props.activePanelKey}
      >
        {makePanel(Properties, t('properties'), 'properties', props)}
        {makePanel(StepPicking, tex('random_step_picking'), 'step-picking',props)}
        {makePanel(Signing, tex('signing'), 'signing', props)}
        {makePanel(Correction, tex('correction'), 'correction', props)}
      </PanelGroup>
    </form>
  )
}

QuizEditor.propTypes = {
  quiz: T.shape({
    title: T.string.isRequired,
    description: T.string.isRequired,
    parameters: T.shape({
      type: T.string.isRequired,
      showMetadata: T.bool.isRequired,
      random: T.bool.isRequired,
      pick: T.number.isRequired,
      duration: T.number.isRequired,
      maxAttempts: T.number.isRequired,
      interruptible: T.bool.isRequired,
      showCorrectionAt: T.string.isRequired,
      correctionDate: T.string,
      anonymous: T.bool.isRequired,
      showScoreAt: T.string.isRequired,
      showStatistics: T.bool.isRequired,
      showFullCorrection: T.bool.isRequired
    }).isRequired,
    _errors: T.shape({
      parameters: T.object.isRequired
    }).isRequired
  }).isRequired,
  updateProperties: T.func.isRequired,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  handlePanelClick: T.func.isRequired
}
