import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import {asset} from '#/main/core/asset'
import {trans} from './../../utils/translate'
import {FormGroup} from './../../components/form/form-group.jsx'
import {Textarea} from './../../components/form/textarea.jsx'


export const TextContent = (props) =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-description`}
      label={trans('text', {}, 'question_types')}
    >
      <Textarea
        id={`item-${props.item.id}-text`}
        content={props.item.text || ''}
        onChange={text => props.onChange({property: 'text', value: text})}
      />
    </FormGroup>
  </fieldset>

TextContent.propTypes = {
}
