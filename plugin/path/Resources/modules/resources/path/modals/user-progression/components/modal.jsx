import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {LinkButton} from '#/main/app/buttons/link/components/button'

import {UserEvaluation as UserEvaluationType} from '#/main/core/resource/prop-types'

import {constants} from '#/plugin/path/resources/path/constants'
import {selectors as dashboardSelectors} from '#/plugin/path/resources/path/dashboard/store'
import {Step as StepType} from '#/plugin/path/resources/path/prop-types'

const ProgressionStep = props =>
  <li>
    <span className="summary-link">
      {props.step.title}

      {props.stepsProgression[props.step.id] && constants.STATUS_UNSEEN !== props.stepsProgression[props.step.id] &&
        <span className="fa fa-fw fa-check pull-right" />
      }
    </span>

    {0 !== props.step.children.length &&
      <ul>
        {props.step.children.map(child =>
          <ProgressionStep key={child.id} step={child} stepsProgression={props.stepsProgression} />
        )}
      </ul>
    }
  </li>

ProgressionStep.propTypes = {
  step: T.shape(StepType.propTypes).isRequired,
  stepsProgression: T.object
}

const UserProgressionModalComponent = props =>
  <Modal
    {...omit(props, 'evaluation', 'steps', 'stepsProgression')}
    icon="fa fa-fw fa-line-chart"
    title={props.evaluation.userName}
  >
    <div className="modal-body">
      <ul className="summary-overview">
        {props.steps.map(step =>
          <ProgressionStep key={step.id} step={step} stepsProgression={props.stepsProgression} />
        )}
      </ul>
    </div>

    <Button
      className="modal-btn btn btn-primary"
      type={CALLBACK_BUTTON}
      primary={false}
      label={trans('close', {}, 'actions')}
      callback={() => props.fadeModal()}
    />
  </Modal>

UserProgressionModalComponent.propTypes = {
  evaluation: T.shape(UserEvaluationType.propTypes).isRequired,
  steps: T.arrayOf(T.shape(StepType.propTypes)).isRequired,
  stepsProgression: T.object,
  fadeModal: T.func.isRequired
}

const UserProgressionModal = connect(
  (state) => ({
    stepsProgression: dashboardSelectors.stepsProgression(state)
  })
)(UserProgressionModalComponent)

export {
  UserProgressionModal
}
