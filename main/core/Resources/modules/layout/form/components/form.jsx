import React from 'react'
import {PropTypes as T} from 'prop-types'

const Form = props => {
  const primarySection = 1 === props.sections.length ? props.sections[0] : props.sections.find(section => section.primary)

  return (
    <form action="#">
      {primarySection &&
        <div className="panel panel-default">
          <fieldset className="panel-body">
            <h2 className="sr-only">{primarySection.title}</h2>
          </fieldset>
        </div>
      }
    </form>
  )
}

Form.propTypes = {
  data: T.object.isRequired,
  errors: T.object,
  validating: T.bool,
  sections: T.arrayOf(T.shape({
    primary: T.bool,
    icon: T.string,
    title: T.string.isRequired,
    fields: T.arrayOf(T.shape({
      id: T.string.isRequired,
      label: T.string.isRequired,
      help: T.string,
      options: T.object
    })).isRequired
  })).isRequired,
}

Form.defaultProps = {
  validating: false
}

export {
  Form
}