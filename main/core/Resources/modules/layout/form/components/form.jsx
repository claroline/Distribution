import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group.jsx'
import classes from 'classnames'
import {t} from '#/main/core/translation'
import update from 'immutability-helper'

export class Form extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({item: this.props.item})
  }

  updateItem(prop, value) {
    let item = this.state.item
    item = update(item, {[prop]: {$set: value}})
    this.setState({item})
  }

  render() {
    return (
      <div>
        <div>
          myform
        </div>
        <fieldset>
          {this.props.definition.map(field => {
            switch(field[1]) {
              case 'text':
                return (
                  <input
                    type="text"
                    defaultValue={this.props.item[field[0]]}
                    onChange={e => {
                      if (this.props.onChange) {
                        this.props.onChange(field[0], e.target.value)
                      }

                      this.updateItem(field[0], e.target.value)
                    }}
                  />
                )
              case 'number':
                return (
                  <input
                    type="number"
                    className="form-control"
                    onChange={e => {
                      if (this.props.onChange) {
                        this.props.onChange(field[0], e.target.value)
                      }

                      this.updateItem(field[0], e.target.value)
                    }}
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
          <button
            className={classes('modal-btn btn', this.props.isDangerous ? 'btn-danger' : 'btn-primary')}
            onClick={() => this.props.onSubmit(this.state.item)}
          >
            {t('Ok')}
          </button>
        </fieldset>
      </div>
    )
  }
}

Form.propTypes = {
  definition: T.array.isRequired,
  item: T.object.isRequired,
  onChange: T.function,
  onSubmit: T.function
}
