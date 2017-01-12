import React, {PropTypes as T} from 'react'

export const Metadata = props => {
  return(
    <div className="panel panel-body">
      <h4>{props.title}</h4>
      <i>{props.description}</i>
    </div>
  )
}

Metadata.propTypes = {
  title: T.string,
  description: T.string
}
