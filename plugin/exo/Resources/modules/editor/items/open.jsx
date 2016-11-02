import React from 'react'
import {Field} from 'redux-form'
import {tex} from './../lib/translate'

// tmp...
const Controls = {}

export const Open = () =>
  <fieldset>
    <Field
      name="maxScore"
      component={Controls.Number}
      min={0}
      label={tex('score_max')}
      help={tex('score_max_help')}
    />
  </fieldset>
