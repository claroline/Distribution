import React, {Component} from 'react'
import Collapse from 'react-bootstrap/lib/Collapse'
import classes from 'classnames'
import debounce from 'lodash/debounce'
import {tex} from './../lib/translate'

const T = React.PropTypes

export const ErrorText = ({error}) =>
  <div className="error-text">
    <span className="fa fa-warning"></span>
    {error}
  </div>

ErrorText.propTypes = {
  error: T.string.isRequired
}

const HelpTexts = ({fieldName, touched, error, help}) =>
  <div className="help-texts">
    {touched && error &&
      <span
        id={helpId(fieldName)}
        className="help-block"
      >
        <span className="fa fa-warning"></span>
        {error}
      </span>
    }
    {help &&
      <span
        id={helpId(fieldName, 'info')}
        className="help-block">
        <span className="fa fa-info-circle"></span>
        {help}
      </span>
    }
  </div>

HelpTexts.propTypes = {
  fieldName: T.string.isRequired,
  touched: T.bool.isRequired,
  error: T.string,
  help: T.string
}

export class Text extends Component {
  constructor(props) {
    super(props)
    this.lastPropValue = props.input.value
    this.state = {value: props.input.value}
    this.debouncedOnChange = debounce(event => {
      props.input.onChange(event.target.value)
    }, 200)
    this.handleChange = event => {
      event.persist()
      this.setState({value: event.target.value})
      this.debouncedOnChange(event)
    }
  }

  getValue() {
    const value = this.props.input.value !== this.lastPropValue ?
      this.props.input.value :
      this.state.value
    this.lastPropValue = this.props.input.value

    return value
  }

  render() {
    return (
      <FormGroup {...this.props}>
        <input
          id={this.props.input.name}
          name={this.props.input.name}
          className="form-control"
          type="text"
          value={this.getValue()}
          onChange={this.handleChange}
          aria-describedby={helpIds(this.props.input.name, this.props.help)}/>
      </FormGroup>
    )
  }
}

Text.propTypes = {
  input: T.shape({
    name: T.string.isRequired,
    value: T.string.isRequired,
    onChange: T.func.isRequired
  }).isRequired,
  help: T.string
}

export const Number = props =>
  <FormGroup {...props}>
    <input
      {...props.input}
      id={props.input.name}
      className="form-control"
      type="number"
      min={props.min}
      max={props.max}
      aria-describedby={helpIds(props.input.name, props.help)}
    />
  </FormGroup>

Number.propTypes = {
  min: T.number,
  max: T.number,
  input: T.shape({
    name: T.string.isRequired
  }).isRequired,
  help: T.string
}




function helpId(fieldName, type = 'error') {
  return `help-${type}-${fieldName}`
}

function helpIds(fieldName, hasHelpInfo) {
  return classes(
    helpId(fieldName),
    {[helpId(fieldName, 'info')]: hasHelpInfo}
  )
}

export default {
  ErrorText,
  CollapsibleSection,
  SingleCheck,
  Text,
  Textarea,
  Select,
  Number,
  Date
}
