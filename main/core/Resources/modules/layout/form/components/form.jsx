import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

export class Form extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <fieldset>
        <div>
          myform
        </div>
        {this.props.definition.map(field => {
          switch(field[1]) {
            case 'text':
              return (<input type="text" className="form-control"/>)
            case 'number':
              return (<input type="number" className="form-control"/>)
            case 'checkbox':
              return (<input type="checkbox"/>)
            case 'checkboxes':
              return field[2].options.map(option => <div>{option[0]}<input type="checkbox" value={option[1]}/></div>)
          }
        })}
      </fieldset>
    )
  }
}

Form.propTypes = {
  definition: T.array.isRequired
}
