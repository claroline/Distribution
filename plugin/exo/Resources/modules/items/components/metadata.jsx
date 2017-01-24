import React, {PropTypes as T} from 'react'

export const Metadata = props => {
  return(
      <div className="question-metadata">
        {props.title !== '' &&
          <h4>{props.title} </h4>
        }
        {props.description !== '' &&
          <i>{props.description} </i>
        }
      </div>
  )
}

Metadata.propTypes = {
  title: T.string,
  description: T.string
}
