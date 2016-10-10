import React from 'react'
import {connect} from 'react-redux'
import {Field, FieldArray, Fields, change} from 'redux-form'

import {t, tex} from './../lib/translate'
import {ITEM_FORM} from './../components/item-form.jsx'
import Controls from './../components/form-controls.jsx'

export const Open = () =>
<form>

  <Field    
    name="maxAttempts"
    component={Controls.Number}
    min={0}
    label={tex('maximum_tries')}
  />
</form>
