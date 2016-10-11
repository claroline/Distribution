import React from 'react'
import {Field, Fields, reduxForm} from 'redux-form'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import classes from 'classnames'
import {t, tex} from './../lib/translate'
import {notBlank} from './../lib/validate'
import Controls from './form-controls.jsx'
import {
  quizTypes,
  correctionModes,
  markModes,
  SHOW_CORRECTION_AT_DATE
} from './../types'

const T = React.PropTypes

const Properties = () =>
  <div>
    <Field
      name="type"
      component={Controls.Select}
      options={quizTypes.map(type => [type[0], tex(type[1])])}
      label={t('type')}
    />
    <Field
      name="title"
      component={Controls.Text}
      label={t('title')}
    />
    <Field
      id="quiz-description"
      name="description"
      component={Controls.Textarea}
      label={t('description')}
    />
    <Field
      name="metadataVisible"
      component={Controls.SingleCheck}
      label={tex('metadata_visible')}
      help={tex('metadata_visible_help')}
    />
  </div>

const StepPicking = props =>
  <div>
    <Field
      name="random"
      component={Controls.SingleCheck}
      label={tex('random_steps_order')}
    />
    {props.random.input.value === true &&
      <div className="sub-fields">
        <Field
          name="pick"
          component={Controls.Number}
          min={0}
          label={tex('number_steps_draw')}
          help={tex('number_steps_draw_help')}
        />
      </div>
    }
  </div>

StepPicking.propTypes = {
  random: T.shape({
    input: T.shape({
      value: T.bool.isRequired
    }).isRequired
  }).isRequired
}

const Signing = () =>
  <div>
    <Field
      name="duration"
      component={Controls.Number}
      min={0}
      label={tex('duration')}
      help={tex('duration_help')}
    />
    <Field
      name="maxAttempts"
      component={Controls.Number}
      min={0}
      label={tex('maximum_attempts')}
      help={tex('number_max_attempts_help')}
    />
    <Field
      name="dispButtonInterrupt"
      component={Controls.SingleCheck}
      label={tex('allow_test_exit')}
    />
    <Field
      name="anonymous"
      component={Controls.SingleCheck}
      label={t('anonymous')}
    />
  </div>

const CorrectionMode = props =>
  <div>
    <Field
      name="correctionMode"
      component={Controls.Select}
      options={correctionModes.map(mode => [mode[0], tex(mode[1])])}
      label={tex('availability_of_correction')}
    />
    {props.correctionMode.input.value === SHOW_CORRECTION_AT_DATE &&
      <div className="sub-fields">
        <Field
          name="correctionDate"
          component={Controls.Date}
          label={tex('correction_date')}
        />
      </div>
    }
  </div>

CorrectionMode.propTypes = {
  correctionMode: T.shape({
    input: T.shape({
      value: T.string.isRequired
    }).isRequired
  }).isRequired
}

const CorrectionOptions = () =>
  <div>
    <Field
      name="markMode"
      component={Controls.Select}
      options={markModes.map(mode => [mode[0], tex(mode[1])])}
      label={tex('score_displaying')}
    />
    <Field
      name="statistics"
      component={Controls.SingleCheck}
      label={tex('statistics')}
    />
    <Field
      name="minimalCorrection"
      component={Controls.SingleCheck}
      label={tex('minimal_correction')}
    />
  </div>

function makeSectionHeader(title, key, {activePanelKey, handlePanelClick}) {
  const caretIcon = key === activePanelKey ? 'fa-caret-down' :'fa-caret-right'
  return (
    <div onClick={() => handlePanelClick(key)}>
      <span>
        <span className={classes('panel-icon', 'fa', caretIcon)}/>
        &nbsp;{title}
      </span>
    </div>
  )
}

let QuizEditor = props =>
  <form>
    <PanelGroup
      accordion
      activeKey={props.activePanelKey}
    >
      <Panel
        eventKey="properties"
        header={makeSectionHeader(t('properties'), 'properties', props)}
      >
        {props.activePanelKey === 'properties' && <Properties/>}
      </Panel>
      <Panel
        eventKey="step-picking"
        header={makeSectionHeader(tex('random_step_picking'), 'step-picking', props)}
      >
        <Fields names={['random', 'pick']} component={StepPicking}/>
      </Panel>
      <Panel
        eventKey="signing"
        header={makeSectionHeader(tex('signing'), 'signing', props)}
      >
        <Signing/>
      </Panel>
      <Panel
        eventKey="correction"
        header={makeSectionHeader(tex('correction'), 'correction', props)}
      >
        <Fields names={['correctionMode', 'correctionDate']} component={CorrectionMode}/>
        <CorrectionOptions/>
      </Panel>
    </PanelGroup>
  </form>

QuizEditor = reduxForm({
  form: 'quiz-properties',
  touchOnChange: true,
  validate: values => ({
    title: notBlank(values.title)
  })
})(QuizEditor)

QuizEditor.propTypes = {
  initialValues: T.object.isRequired,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  handlePanelClick: T.func.isRequired
}

export {QuizEditor}
