import React, {PropTypes as T} from 'react'
import {tex} from './../lib/translate'
import {actions} from './open'
import get from 'lodash/get'
import {FormGroup} from './../components/form/form-group.jsx'

export const Open = (props) =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-maxScore`}
      label={tex('score_max')}
      error={get(props.item, '_errors.maxScore')}
    >
      <input
        id={`item-${props.item.id}-maxScore`}
        type="number"
        min="0"
        value={props.item.maxScore}
        className="form-control"
        onChange={e => props.onChange(
          actions.update('maxScore', e.target.value)
        )}
      />
    </FormGroup>

    <FormGroup
      controlId={`item-${props.item.id}-maxLength`}
      label={tex('open_maximum_length')}
      error={get(props.item, '_errors.maxLength')}
    >
      <input
        id={`item-${props.item.id}-maxLength`}
        type="number"
        min="0"
        value={props.item.maxLength}
        className="form-control"
        onChange={e => props.onChange(
          actions.update('maxLength', e.target.value)
        )}
      />
    </FormGroup>
  </fieldset>

Open.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    maxScore: T.number.isRequired,
    maxLength: T.number.isRequired
  }).isRequired,
  onChange: T.func.isRequired
}
