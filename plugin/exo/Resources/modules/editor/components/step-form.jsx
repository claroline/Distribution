import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {t, tex} from './../lib/translate'
import Controls from './form-controls.jsx'

let StepForm = props =>
  <form>
    <Field
      name="title"
      component={Controls.Text}
      label={t('title')}
    />
    <Field
      id={`step-${props.stepId}-description`}
      name="description"
      component={Controls.Textarea}
      label={t('description')}
    />
    <Field
      id={`step-${props.stepId}-max-attempts`}
      name="maxAttempts"
      component={Controls.Number}
      min={0}
      label={tex('maximum_tries')}
    />
  </form>

const T = React.PropTypes

StepForm.propTypes = {
  stepId: T.string.isRequired,
  initialValues: T.object.isRequired
}

StepForm = reduxForm({
  form: 'step-properties'
})(StepForm)

export {StepForm}
