import React from 'react'
import {PropTypes as T} from 'prop-types'

import {number} from '#/main/app/intl'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'

import {UserEvaluation as UserEvaluationTypes} from '#/main/core/resource/prop-types'

/**
 * Renders a gauge to display progression of the user in the resource evaluation.
 */
const UserProgression = props => {
  let progression = 0
  if (props.userEvaluation.progression) {
    progression = props.userEvaluation.progression
    if (props.userEvaluation.progressionMax) {
      progression = (progression / props.userEvaluation.progressionMax) * 100
    }
  }

  return (
    <LiquidGauge
      id="user-progression"
      type="user"
      value={progression}
      displayValue={(value) => number(value) + '%'}
      width={props.width}
      height={props.height}
    />
  )
}

UserProgression.propTypes = {
  userEvaluation: T.shape(
    UserEvaluationTypes.propTypes
  ).isRequired,
  width: T.number,
  height: T.number
}

export {
  UserProgression
}
