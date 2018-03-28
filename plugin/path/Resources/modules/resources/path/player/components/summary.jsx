import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {NavLink} from '#/main/core/router'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {PathSummary} from '#/plugin/path/resources/path/components/summary'

const SummaryStep = props =>
  <li className="summary-link-container">
    <div className="summary-link">
      <NavLink to={`/play/${props.step.id}`}>
        <span className={classes('step-progression fa fa-circle', props.step.userProgression && props.step.userProgression.status)} />

        {props.opened && props.step.title}
      </NavLink>
    </div>

    {props.step.children && 0 !== props.step.children.length &&
      <ul className="step-children">
        {props.step.children.map(child =>
          <SummaryStep key={child.id} opened={props.opened} step={child} />
        )}
      </ul>
    }
  </li>

SummaryStep.propTypes = {
  opened: T.bool,
  step: T.shape(
    StepTypes.propTypes
  ).isRequired
}

const Summary = props =>
  <PathSummary>
    <ul className="summary">
      {props.steps.map(step =>
        <SummaryStep key={step.id} opened={props.opened} step={step} />
      )}
    </ul>
  </PathSummary>

Summary.propTypes = {
  opened: T.bool,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  ))
}

Summary.defaultProps = {
  steps: []
}

export {
  Summary
}
