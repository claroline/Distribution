import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import {trans} from './../../utils/translate'
import {FormGroup} from './../../components/form/form-group.jsx'
import {Textarea} from './../../components/form/textarea.jsx'
import {actions} from './editor'

export const TextContent = (props) =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-description`}
      label={trans('text', {}, 'question_types')}
      warnOnly={!props.validating}
      error={get(props.item, '_errors.text')}
    >
      <Textarea
        id={`item-${props.item.id}-text`}
        content={props.item.text || ''}
        onChange={text => props.onChange(actions.updateText(text))}
      />
    </FormGroup>
  </fieldset>

TextContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}
