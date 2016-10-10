import React from 'react'
import {Field} from 'redux-form'
import {tex} from './../lib/translate'
import Controls from './../components/form-controls.jsx'

export const Open = () =>
<fieldset>
  <Field
    name="score"
    component={Controls.Number}
    min={0}
    label={tex('score')}
  />
  <Field
    name="maxLength"
    component={Controls.Number}
    min={0}
    label={tex('open_max_length')}
  />
</fieldset>
