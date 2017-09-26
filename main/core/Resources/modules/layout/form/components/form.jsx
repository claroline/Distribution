import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group.jsx'

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
              return (
                <input
                  type="text"
                  value={this.props.item[field[0]]}
                  onChange={e => this.props.onChange(field[0], e.target.value)}
                />
              )
            case 'number':
              return (
                <input
                  type="number"
                  className="form-control"
                  onChange={e => this.props.onChange(field[0], e.target.value)}
                />
              )
            case 'checkbox':
              return (
                <input
                  type="checkbox"
                  value={this.props.item[field[0]]}
                />
              )
            case 'checkboxes':
              return field[2].options.map(option => <div>{option[0]}<input type="checkbox" value={option[1]}/></div>)
          }
        })}
      </fieldset>
    )
  }
}

Form.propTypes = {
  definition: T.array.isRequired,
  item: T.object.isRequired,
  onChange: T.object.isRequired
}
