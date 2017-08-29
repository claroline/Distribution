import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/core/translation'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'
import {actions} from './editor'

export const TextContent = (props) =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-data`}
      label={trans('text', {}, 'question_types')}
      warnOnly={!props.validating}
      error={get(props.item, '_errors.data')}
    >
      <Textarea
        id={`item-${props.item.id}-text`}
        content={props.item.data || ''}
        onChange={data => props.onChange(actions.updateItemContentText(data))}
      />
    </FormGroup>
  </fieldset>

TextContent.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    data: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}
