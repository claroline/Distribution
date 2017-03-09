import React, {PropTypes as T} from 'react'


export const Boolean = props => {
  return (
    <div className="boolean-editor">
      <div>SELECT</div>
      <div className="choices-container">
        {props.choices.map(choice => {
          return (
            <div key={choice.id} className="choice">
              {choice.id}-{choice.data}
            </div>
          )
        })

        }

      </div>
    </div>
  )
}

Boolean.propTypes = {
  item: T.shape({
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired,
      _feedback: T.string,
      _score: T.number.isRequired
    })).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}
