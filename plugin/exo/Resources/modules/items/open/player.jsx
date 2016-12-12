import React, {PropTypes as T} from 'react'
import {actions} from './player'
import {Textarea} from './../../components/form/textarea.jsx'

export const Open = (props) =>
<div>
  <Textarea
    id={`open-${props.item.id}-question`}
    content={props.item.content}
  />
  <Textarea
    id={`open-${props.item.id}-data`}
    content={props.item.data}
    onChange={(value) => props.onChange(
      actions.updateAnswer(value)
    )}
  />
</div>


Open.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    content: T.string.isRequired,
    data: T.string,
    maxLength: T.number.isRequired
  }).isRequired,
  onChange: T.func.isRequired
}
