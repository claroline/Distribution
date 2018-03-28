import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {PathSummary} from '#/plugin/path/resources/path/components/summary.jsx'

// todo : replaces copy/paste feature by a duplicate one (that's how it works elsewhere)

const SummaryStep = props =>
  <li className="summary-link-container">
    <div className="summary-link">
      <NavLink to={`/edit/${props.step.id}`}>
        <span className="step-progression fa fa-circle" />

        {props.opened && props.step.title}
      </NavLink>

      {props.opened &&
        <div className="step-actions">
          <TooltipAction
            id={`step-${props.step.id}-add`}
            position="bottom"
            className="btn-link btn-summary"
            icon="fa fa-fw fa-plus"
            label={trans('step_add_child', {}, 'path')}
            action={() => props.addStep(props.step.id)}
          />

          <TooltipAction
            id={`step-${props.step.id}-copy`}
            position="bottom"
            className="btn-link btn-summary"
            icon="fa fa-fw fa-files-o"
            label={trans('copy_step', {}, 'path')}
            action={() => props.copyStep(props.step)}
          />

          {props.copy &&
            <TooltipAction
              id={`step-${props.step.id}-paste`}
              position="bottom"
              className="btn-link btn-summary"
              icon="fa fa-fw fa-clipboard"
              label={trans('add_copied_step', {}, 'path')}
              action={() => {
                props.pasteStep(props.step.id, props.copy)
                props.resetStepCopy()
              }}
            />
          }

          <TooltipAction
            id={`step-${props.step.id}-delete`}
            position="bottom"
            className="btn-link btn-summary"
            icon="fa fa-fw fa-trash-o"
            label={trans('delete')}
            action={() => props.removeStep(props.step.id)}
          />
        </div>
      }
    </div>

    {props.step.children.length > 0 &&
      <ul className="step-children">
        {props.step.children.map(child =>
          <SummaryStep
            key={`summary-step-${child.id}`}
            opened={props.opened}
            step={child}
            copy={props.copy}
            addStep={props.addStep}
            removeStep={props.removeStep}
            copyStep={props.copyStep}
            pasteStep={props.pasteStep}
            resetStepCopy={props.resetStepCopy}
          />
        )}
      </ul>
    }
  </li>

SummaryStep.propTypes = {
  opened: T.bool,
  step: T.shape(StepTypes.propTypes).isRequired,
  copy: T.shape(StepTypes.propTypes),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  copyStep: T.func.isRequired,
  pasteStep: T.func.isRequired,
  resetStepCopy: T.func.isRequired
}

const Summary = props =>
  <PathSummary>
    <ul className="summary">
      <li className="summary-link-container">
        <NavLink to="/edit/parameters" className="summary-link">
          <span className="fa fa-cog" />
          {props.opened && trans('parameters')}
        </NavLink>
      </li>

      {props.steps.map(step =>
        <SummaryStep
          key={`summary-step-${step.id}`}
          opened={props.opened}
          step={step}
          copy={props.copy}
          addStep={props.addStep}
          removeStep={props.removeStep}
          copyStep={props.copyStep}
          pasteStep={props.pasteStep}
          resetStepCopy={props.resetStepCopy}
        />
      )}

      <li className="summary-link-container">
        <div className="summary-link">
          <button
            type="button"
            className="btn btn-link btn-add"
            onClick={() => props.addStep(null)}
          >
            <span className="fa fa-plus" />

            {props.opened && trans('step_add', {}, 'path')}
          </button>

          {props.opened && props.copy &&
            <TooltipAction
              id="step-paste"
              position="bottom"
              className="btn-link btn-summary"
              icon="fa fa-fw fa-clipboard"
              label={trans('add_copied_step', {}, 'path')}
              action={() => props.pasteStep(null, props.copy)}
            />
          }
        </div>
      </li>
    </ul>
  </PathSummary>

Summary.propTypes = {
  opened: T.bool,
  steps: T.array.isRequired,
  copy: T.shape(StepTypes.propTypes),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  copyStep: T.func.isRequired,
  pasteStep: T.func.isRequired
}

export {
  Summary
}
