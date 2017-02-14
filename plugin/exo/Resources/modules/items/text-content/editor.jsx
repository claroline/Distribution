import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import {asset} from '#/main/core/asset'
import {tex} from './../../utils/translate'
import {FormGroup} from './../../components/form/form-group.jsx'
import {Textarea} from './../../components/form/textarea.jsx'


export const TextContent = (props) =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-description`}
      label="label"
    >
      <Textarea
        id={`item-${props.item.id}-description`}
        content={props.item.description || ''}
        onChange={text => props.onChange('description', text)}
      />
    </FormGroup>
  </fieldset>

TextContent.propTypes = {
}
