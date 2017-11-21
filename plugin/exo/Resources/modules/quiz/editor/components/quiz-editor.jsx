import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import classes from 'classnames'
import isObject from 'lodash/isObject'
import get from 'lodash/get'
import times from 'lodash/times'

import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

import {tex, t} from '#/main/core/translation'

import {ActivableSet} from '#/main/core/layout/form/components/fieldset/activable-set.jsx'
import {ConditionalSet} from '#/main/core/layout/form/components/fieldset/conditional-set.jsx'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {DateGroup} from '#/main/core/layout/form/components/group/date-group.jsx'
import {NumberGroup} from '#/main/core/layout/form/components/group/number-group.jsx'
import {RadioGroup} from '#/main/core/layout/form/components/group/radio-group.jsx'
import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'
import {ValidationStatus} from '#/plugin/exo/components/validation-status.jsx'

import {
  shuffleModes,
  correctionModes,
  markModes,
  numberingModes,
  statisticsModes,
  SHUFFLE_ALWAYS,
  SHUFFLE_ONCE,
  SHUFFLE_NEVER,
  SHOW_CORRECTION_AT_DATE,
  TOTAL_SCORE_ON_CUSTOM,
  TOTAL_SCORE_ON_DEFAULT,
  TOTAL_SCORE_ON_DEFAULT_VALUE
} from './../../enums'

import {actions} from './../actions'
import {select} from './../selectors'

const Display = props =>
  <fieldset>
    <ActivableSet
      id="quiz-show-overview"
      label={tex('show_overview')}
      activated={props.parameters.showOverview}
      onChange={checked => props.onChange('parameters.showOverview', checked)}
    >
      <HtmlGroup
        controlId="quiz-description"
        label={tex('overview_message')}
        content={props.description}
        onChange={description => props.onChange('description', description)}
      />

      <CheckGroup
        checkId="quiz-show-metadata"
        checked={props.parameters.showMetadata}
        label={tex('metadata_visible')}
        help={tex('metadata_visible_help')}
        onChange={checked => props.onChange('parameters.showMetadata', checked)}
      />
    </ActivableSet>

    <ActivableSet
      id="quiz-show-end-page"
      label={tex('show_end_page')}
      activated={props.parameters.showEndPage}
      onChange={checked => props.onChange('parameters.showEndPage', checked)}
    >
      <HtmlGroup
        controlId="quiz-end-message"
        label={tex('end_message')}
        content={props.parameters.endMessage}
        onChange={endMessage => props.onChange('parameters.endMessage', endMessage)}
      />
    </ActivableSet>

    <RadioGroup
      controlId="quiz-numbering"
      label={tex('quiz_numbering')}
      options={numberingModes}
      checkedValue={props.parameters.numbering}
      onChange={numbering => props.onChange('parameters.numbering', numbering)}
    />
  </fieldset>

Display.propTypes = {
  description: T.string.isRequired,
  parameters: T.shape({
    showOverview: T.bool.isRequired,
    showMetadata: T.bool.isRequired,
    showEndPage: T.bool.isRequired,
    endMessage: T.string,
    numbering: T.string
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

const Access = props =>
  <fieldset>
    <NumberGroup
      controlId="quiz-maxPapers"
      label={tex('maximum_papers')}
      min={0}
      value={props.parameters.maxPapers}
      onChange={value => props.onChange('parameters.maxPapers', value)}
      help={tex('maximum_papers_attempts_help')}
      warnOnly={!props.validating}
      error={get(props, 'errors.parameters.maxPapers')}
    />
  </fieldset>

Access.propTypes = {
  parameters: T.shape({
    maxPapers: T.number.isRequired
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

class StepPicking extends Component
{
  componentDidMount() {
    this.setState({tag: this.getTagList()[0]})
  }

  handleTagSelect(value) {
    this.setState({tag: value})
  }

  handleTagAmount(value) {
    this.setState({amount: value})
  }

  getTagList() {
    return this.props.tags
  }

  getStateQuestionCount() {
    if (this.state) {
      return Object.keys(this.props.items).map(key => this.props.items[key]).reduce((total, item) => {
        return item.tags.findIndex((tagData) => tagData == this.state.tag) >= 0 ? total + 1: total
      }, 0)
    }

    return 0
  }

  render() {
    const props = this.props

    return (
      <fieldset>
        <CheckGroup
          checkId={'item-tag-picking'}
          label={tex('pick-tag')}
          checked={this.props.parameters.pickByTag || false}
          onChange={checked => props.onChange('parameters.pickByTag', checked)}
        />

        {props.parameters.pickByTag &&
        <div>
          <select className="form-control" onChange={e => this.handleTagSelect(e.target.value)}>
            {props.tags.map(tag =>
              <option>{tag}</option>
            )}
          </select>

          {props.parameters.randomTags.pick.map(el =>
            <div className="item-tag label label-default">
              <span className="tag-title">
                {el[1]} {el[0]}
              </span>
              <span
                className="tag-remove-btn fa fa-fw fa-times pointer-hand"
                onClick={() => props.onChange('parameters.randomTags.pick', ['remove', [el[0], el[1]]])}
              />
            </div>
          )}

          <FormGroup
            controlId="tag-amount"
            label={tex('tag-amount')}
            help={tex('tag-amount-help')}
            warnOnly={!props.validating}
          >
            <select
              id="tag-amount"
              className="form-control input-sm"
              onChange={e => this.handleTagAmount(e.target.value)}
            >
              {times(this.getStateQuestionCount(), i => <option>{i + 1}</option>)}
            </select>
          </FormGroup>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => props.onChange('parameters.randomTags.pick', ['add', [this.state.tag, this.state.amount]])}
          >
            {t('add')}
          </button>

          <NumberGroup
            controlId="quiz-pageSize"
            label={tex('number_question_page')}
            min={0}
            value={props.parameters.randomTags.pageSize}
            onChange={value => props.onChange('parameters.randomTags.pageSize', value)}
            help={tex('number_question_page-help')}
            warnOnly={!props.validating}
            error={get(props, 'errors.parameters.randomTags.pageSize')}
          />
        </div>
        }

        {!props.parameters.pickByTag &&
        <div>
          <RadioGroup
            controlId="quiz-random-pick"
            label={tex('random_picking')}
            options={shuffleModes}
            checkedValue={props.parameters.randomPick}
            onChange={mode => props.onChange('parameters.randomPick', mode)}
          />

          <ConditionalSet condition={SHUFFLE_NEVER !== props.parameters.randomPick}>
            <NumberGroup
              controlId="quiz-pick"
              label={tex('number_steps_draw')}
              min={0}
              value={props.parameters.pick}
              onChange={value => props.onChange('parameters.pick', value)}
              help={tex('number_steps_draw_help')}
              warnOnly={!props.validating}
              error={get(props, 'errors.parameters.pick')}
            />
          </ConditionalSet>

          <RadioGroup
            controlId="quiz-random-order"
            label={tex('random_order')}
            options={SHUFFLE_ALWAYS !== props.parameters.randomPick ? shuffleModes : shuffleModes.filter(m => SHUFFLE_ONCE !== m.value)}
            checkedValue={props.parameters.randomOrder}
            onChange={mode => props.onChange('parameters.randomOrder', mode)}
          />
        </div>
        }
    </fieldset>
  )
  }
}

StepPicking.propTypes = {
  parameters: T.shape({
    pick: T.number.isRequired,
    randomPick: T.string.isRequired,
    randomOrder: T.string.isRequired,
    pickByTag: T.bool.isRequired
  }).isRequired,
  tags: T.array.isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

const Signing = props =>
  <fieldset>
    <NumberGroup
      controlId="quiz-maxAttempts"
      label={tex('maximum_attempts')}
      min={0}
      value={props.parameters.maxAttempts}
      onChange={value => props.onChange('parameters.maxAttempts', value)}
      help={tex('number_max_attempts_help')}
      warnOnly={!props.validating}
      error={get(props, 'errors.parameters.maxAttempts')}
    />

    <ConditionalSet condition={props.parameters.maxAttempts > 0}>
      <NumberGroup
        controlId="quiz-maxAttemptsPerDay"
        label={tex('maximum_attempts_per_day')}
        min={0}
        value={props.parameters.maxAttemptsPerDay}
        onChange={value => props.onChange('parameters.maxAttemptsPerDay', value)}
        help={tex('number_max_attempts_per_day_help')}
        warnOnly={!props.validating}
        error={get(props, 'errors.parameters.maxAttemptsPerDay')}
      />
    </ConditionalSet>

    <CheckGroup
      checkId="quiz-show-feedback"
      checked={props.parameters.showFeedback}
      label={tex('show_feedback')}
      onChange={checked => props.onChange('parameters.showFeedback', checked)}
    />

    <CheckGroup
      checkId="quiz-interruptible"
      checked={props.parameters.interruptible}
      label={tex('allow_test_exit')}
      onChange={checked => props.onChange('parameters.interruptible', checked)}
    />

    <CheckGroup
      checkId="quiz-mandatoryQuestions"
      checked={props.parameters.mandatoryQuestions}
      label={tex('mandatory_questions')}
      onChange={checked => props.onChange('parameters.mandatoryQuestions', checked)}
    />
  </fieldset>

Signing.propTypes = {
  parameters: T.shape({
    duration: T.number.isRequired,
    maxAttempts: T.number.isRequired,
    mandatoryQuestions: T.bool.isRequired,
    maxAttemptsPerDay: T.number.isRequired,
    interruptible: T.bool.isRequired,
    showFeedback: T.bool.isRequired
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

const Correction = props =>
  <fieldset>
    <SelectGroup
      controlId="quiz-showCorrectionAt"
      label={tex('availability_of_correction')}
      options={correctionModes}
      selectedValue={props.parameters.showCorrectionAt}
      onChange={selected => props.onChange('parameters.showCorrectionAt', selected)}
    />

    <ConditionalSet condition={props.parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE}>
      <DateGroup
        controlId="quiz-correctionDate"
        label={tex('correction_date')}
        value={props.parameters.correctionDate}
        onChange={date => props.onChange('parameters.correctionDate', date)}
      />
    </ConditionalSet>

    <CheckGroup
      checkId="quiz-anonymizeAttempts"
      checked={props.parameters.anonymizeAttempts}
      label={tex('anonymous')}
      onChange={checked => props.onChange('parameters.anonymizeAttempts', checked)}
    />

    <CheckGroup
      checkId="quiz-showFullCorrection"
      checked={props.parameters.showFullCorrection}
      label={tex('maximal_correction')}
      onChange={checked => props.onChange('parameters.showFullCorrection', checked)}
    />

    <ActivableSet
      id="quiz-showStatistics"
      label={tex('statistics')}
      activated={props.parameters.showStatistics}
      onChange={checked => props.onChange('parameters.showStatistics', checked)}
    >
      <SelectGroup
        controlId="quiz-allPapersStatistics"
        label={tex('statistics_options')}
        options={statisticsModes}
        selectedValue={props.parameters.allPapersStatistics}
        onChange={selected => props.onChange('parameters.allPapersStatistics', 'true' === selected)}
      />
    </ActivableSet>
  </fieldset>

Correction.propTypes = {
  parameters: T.shape({
    showCorrectionAt: T.string.isRequired,
    showScoreAt: T.string.isRequired,
    showFullCorrection: T.bool.isRequired,
    showStatistics: T.bool.isRequired,
    allPapersStatistics: T.bool.isRequired,
    anonymizeAttempts: T.bool.isRequired,
    correctionDate: T.string
  }).isRequired,
  onChange: T.func.isRequired
}

const Score = props =>
  <fieldset>
    <SelectGroup
      controlId="quiz-showScoreAt"
      label={tex('score_displaying')}
      options={markModes}
      selectedValue={props.parameters.showScoreAt}
      onChange={selected => props.onChange('parameters.showScoreAt', selected)}
    />

    <RadioGroup
      controlId="quiz-totalScoreOn"
      label={tex('quiz_total_score_on')}
      options={[
        {value: TOTAL_SCORE_ON_DEFAULT, label: tex('quiz_total_score_on_mode_default')},
        {value: TOTAL_SCORE_ON_CUSTOM, label: tex('quiz_total_score_on_mode_custom')}
      ]}
      checkedValue={props.parameters.totalScoreOn > 0 ? TOTAL_SCORE_ON_CUSTOM : TOTAL_SCORE_ON_DEFAULT}
      onChange={mode => props.onChange('parameters.totalScoreOn', mode === TOTAL_SCORE_ON_DEFAULT ? 0:TOTAL_SCORE_ON_DEFAULT_VALUE)}
    />

    <ConditionalSet condition={props.parameters.totalScoreOn > 0}>
      <NumberGroup
        controlId="quiz-total-score-on-value"
        label={tex('quiz_total_score')}
        min={1}
        value={props.parameters.totalScoreOn}
        onChange={value => props.onChange('parameters.totalScoreOn', value)}
      />
    </ConditionalSet>

    <NumberGroup
      controlId="quiz-success-score"
      label={tex('quiz_success_score')}
      min={0}
      max={100}
      value={props.parameters.successScore || ''}
      onChange={value => props.onChange('parameters.successScore', value)}
    />
  </fieldset>

Score.propTypes = {
  parameters: T.shape({
    showScoreAt: T.string.isRequired,
    totalScoreOn: T.number,
    successScore: T.number
  }).isRequired,
  onChange: T.func.isRequired
}

function makePanel(Section, title, key, props, errorProps) {
  const caretIcon = key === props.activePanelKey ?
    'fa-caret-down' :
    'fa-caret-right'

  const Header =
    <div onClick={() => props.handlePanelClick(key)} className="editor-panel-title">
      <span className={classes('fa fa-fw', caretIcon)}/>
      &nbsp;{title}
      {hasPanelError(props, errorProps) &&
        <ValidationStatus
          id={`quiz-${key}-status-tip`}
          validating={props.validating}
        />
      }
    </div>

  return (
    <Panel
      eventKey={key}
      header={Header}
    >
      <Section
        onChange={props.updateProperties}
        errors={props.quiz._errors}
        validating={props.validating}
        tags={props.tags}
        {...props.quiz}
      />
    </Panel>
  )
}

makePanel.propTypes = {
  activePanelKey: T.string.isRequired,
  validating: T.bool.isRequired,
  handlePanelClick: T.func.isRequired,
  updateProperties: T.func.isRequired,
  quiz: T.object.isRequired,
  tags: T.array.isRequired,
  _errors: T.object
}

function hasPanelError(allProps, errorPropNames) {
  if (!errorPropNames || !isObject(allProps.quiz._errors)) {
    return false
  }

  const errorFields = Object.keys(allProps.quiz._errors)

  return !!errorPropNames.find(name =>
    !!errorFields.find(field => field === name)
  )
}

const QuizEditor = props =>
  <form>
    <PanelGroup
      accordion
      activeKey={props.activePanelKey}
    >
      {makePanel(Display, t('display_parameters'), 'display_mode', props)}
      {makePanel(StepPicking, tex('step_picking'), 'step-picking', props, ['pick'])}
      {makePanel(Signing, tex('signing'), 'signing', props, ['duration', 'maxAttempts'])}
      {makePanel(Correction, tex('correction'), 'correction', props)}
      {makePanel(Score, tex('score'), 'score', props)}
      {makePanel(Access, tex('access'), 'access', props)}
    </PanelGroup>
  </form>

QuizEditor.propTypes = {
  quiz: T.object.isRequired,
  tags: T.array.isRequired,
  validating: T.bool.isRequired,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  updateProperties: T.func.isRequired,
  handlePanelClick: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    quiz: select.quiz(state),
    tags: select.tags(state),
    validating: select.validating(state),
    activePanelKey: select.quizOpenPanel(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateProperties: (propertyPath, value) => dispatch(actions.updateQuiz(propertyPath, value)),
    handlePanelClick: (panelKey) => dispatch(actions.selectQuizPanel(panelKey))
  }
}

const ConnectedQuizEditor = connect(mapStateToProps, mapDispatchToProps)(QuizEditor)

export {
  ConnectedQuizEditor as QuizEditor
}
