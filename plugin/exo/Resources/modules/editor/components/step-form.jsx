import React, {PropTypes as T} from 'react'
import {t, tex} from './../lib/translate'
import {FormGroup} from './form/form-group.jsx'
import {Textarea} from './form/textarea.jsx'

export const StepForm = props => {
  return (
    <form>
      <FormGroup
        controlId={`step-${props.id}-title`}
        label={t('title')}
      >
        <input
          id={`step-${props.id}-title`}
          type="text"
          value={props.title}
          className="form-control"
          onChange={e => props.onChange({title: e.target.value})}
        />
      </FormGroup>
      <FormGroup
        controlId={`step-${props.id}-description`}
        label={t('description')}
      >
        <Textarea
          id={`step-${props.id}-description`}
          content={props.description}
          onChange={description => props.onChange({description})}
        />
      </FormGroup>
      <FormGroup
        controlId={`step-${props.id}-maxAttempts`}
        label={tex('maximum_tries')}
        error={props._errors.parameters.maxAttempts}
      >
        <input
          id={`step-${props.id}-maxAttempts`}
          type="number"
          min="0"
          value={props.parameters.maxAttempts}
          className="form-control"
          onChange={e => props.onChange({parameters: {maxAttempts: e.target.value}})}
        />
      </FormGroup>
    </form>
  )
}

StepForm.propTypes = {
  id: T.string.isRequired,
  title: T.string.isRequired,
  description: T.string.isRequired,
  parameters: T.shape({
    maxAttempts: T.number.isRequired
  }),
  _errors: T.shape({
    parameters: T.object.isRequired
  }),
  onChange: T.func.isRequired
}
