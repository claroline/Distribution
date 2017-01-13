import React, {PropTypes as T} from 'react'
import {t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {FormGroup} from './../../components/form/form-group.jsx'
import {actions} from './editor'

function addHole() {
  return actions.addHole()
}

export const Cloze = (props) => {
  return(
    <div>
      <FormGroup controlId="cloze-text" label={t('text')}>
        <Textarea
          id={props.item.id}
          onChange={(value) => props.onChange(actions.updateText(value))}
          content={props.item._text}
        />
      </FormGroup>
      <button onClick={() => props.onChange(addHole())}> Create Cloze </button>
    </div>
  )
}

Cloze.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired,
    _text: T.string.isRequired
  }),
  onChange: T.func.isRequired
}
