import React, {PropTypes as T} from 'react'
import {Textarea} from './../../components/form/textarea.jsx'

export const Cloze = (props) => {
  return(
    <div>
      <div> Cloze text </div>
      <Textarea
        id={props.item.id}
      />
    </div>
  )
}

Cloze.propTypes = {
  item: T.object()
}
