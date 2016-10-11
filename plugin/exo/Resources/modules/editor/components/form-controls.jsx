import React, {Component} from 'react'
import Collapse from 'react-bootstrap/lib/Collapse'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import classes from 'classnames'
import debounce from 'lodash/debounce'
import {tex} from './../lib/translate'
import 'react-datepicker/dist/react-datepicker.css'

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

export const SingleCheck = ({input, label, meta: {touched, error}, help}) =>
  <div className={classes('form-group', 'check-group', {'has-error': touched && error})}>
    <div className="checkbox">
      <input
        id={input.name}
        type="checkbox"
        checked={input.value}
        aria-describedby={helpIds(input.name, help)}
        { ...input}/>
    </div>
    <label className="control-label" htmlFor={input.name}>{label}</label>
    <HelpTexts
      fieldName={input.name}
      touched={touched}
      error={error}
      help={help}/>
  </div>

SingleCheck.propTypes = {
  input: T.shape({
    name: T.string.isRequired,
    value: T.bool.isRequired
  }),
  label: T.string.isRequired,
  meta: T.shape({
    touched: T.bool.isRequired,
    error: T.string
  }),
  help: T.string
}

const FormGroup = ({input, label, meta: {touched, error}, children, help}) =>
  <div className={classes('form-group', {'has-error': touched && error})}>
    {label &&
      <label className="control-label" htmlFor={input.name}>{label}</label>
    }
    {children}
    <HelpTexts
      fieldName={input.name}
      touched={touched}
      error={error}
      help={help}/>
  </div>

FormGroup.propTypes = {
  input: T.shape({
    name: T.string.isRequired,
    value: T.any.isRequired
  }),
  meta: T.shape({
    touched: T.bool.isRequired,
    error: T.string
  }),
  children: T.oneOfType([T.object, T.array]).isRequired,
  label: T.string,
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
  }),
  help: T.string
}

// see https://github.com/lovasoa/react-contenteditable
class ContentEditable extends Component {
  constructor() {
    super()
    this.emitChange = this.emitChange.bind(this)
  }

  render() {
    return React.createElement('div', {
      ref: el => this.el = el,
      onInput: this.emitChange,
      onBlur: this.emitChange,
      dangerouslySetInnerHTML: {__html: this.props.content},
      contentEditable: true,
      title: this.props.title,
      role: 'textbox',
      className: 'form-control',
      'aria-multiline': true,
      style: {minHeight: `${this.props.minRows * 32}px`}
    })
  }

  shouldComponentUpdate(nextProps) {
    return (
      !this.el
      || (nextProps.content !== this.el.innerHTML
        && nextProps.content !== this.props.content)
    )
  }

  componentDidUpdate() {
    if (this.el && this.props.content !== this.el.innerHTML) {
      this.el.innerHTML = this.props.content
    }
  }

  emitChange() {
    if (!this.el) {
      return
    }

    const content = this.el.innerHTML

    if (this.props.onChange && content !== this.lastContent) {
      this.props.onChange(content)
    }

    this.lastContent = content
  }
}

ContentEditable.propTypes = {
  minRows: T.number.isRequired,
  content: T.string.isRequired,
  onChange: T.func.isRequired,
  title: T.string
}

class Tinymce extends Component {
  constructor(props) {
    super(props)
    this.editor = null
  }

  componentDidMount() {
    const interval = setInterval(() => {
      const editor = window.tinymce.get(this.props.id)

      if (editor) {
        this.editor = editor
        this.editor.on('change', e => {
          this.props.onChange(e.target.getContent())
        })
        clearInterval(interval)
      }
    }, 100)
  }

  componentWillReceiveProps(nextProps) {
    this.editor.setContent(nextProps.content)
  }

  componentWillUnmount() {
    this.editor.destroy()
  }

  render() {
    return (
      <textarea
        id={this.props.id}
        title={this.props.title}
        className="form-control claroline-tiny-mce hide"
        defaultValue={this.props.content}
      />
    )
  }
}

Tinymce.propTypes = {
  id: T.string.isRequired,
  content: T.string.isRequired,
  onChange: T.func.isRequired,
  title: T.string
}

export class Textarea extends Component {
  constructor(props) {
    super(props)
    this.state = {minimal: true}
  }

  makeMinimalEditor() {
    return (
      <ContentEditable
        title={this.props.title}
        minRows={this.props.minRows}
        content={this.props.input.value}
        onChange={this.props.input.onChange}
      />
    )
  }

  makeFullEditor() {
    return (
      <Tinymce
        id={this.props.id}
        title={this.props.title}
        content={this.props.input.value}
        onChange={this.props.input.onChange}
      />
    )
  }

  render() {
    return (
      <FormGroup {...this.props}>
        <div className={classes('text-editor', {'minimal': this.state.minimal === true})}>
          <span
            role="button"
            title={tex(this.state.minimal ? 'rich_text_tools' : 'minimize')}
            className={classes(
              'toolbar-toggle',
              'fa',
              this.state.minimal ? 'fa-plus-circle' : 'fa-minus-circle'
            )}
            onClick={() => this.setState({minimal: !this.state.minimal})}
          />
          {this.state.minimal ?
            this.makeMinimalEditor() :
            this.makeFullEditor()
          }
        </div>
      </FormGroup>
    )
  }
}

Textarea.propTypes = {
  id: T.string.isRequired,
  minRows: T.number,
  title: T.string,
  input: T.shape({
    value: T.string.isRequired,
    onChange: T.func.isRequired
  })
}

Textarea.defaultProps = {
  minRows: 2
}

export const Select = props =>
  <FormGroup {...props}>
    <select
      {...props.input}
      id={props.input.name}
      className="form-control"
      onChange={e => props.input.onChange(e.target.value)}>
      {props.options.map(v =>
        <option key={v[0]} value={v[0]}>{v[1]}</option>
      )}
    </select>
  </FormGroup>

Select.propTypes = {
  options: T.arrayOf(T.arrayOf(T.string)).isRequired,
  input: T.shape({
    name: T.string.isRequired,
    onChange: T.func.isRequired
  })
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
  }),
  help: T.string
}

// tmp
const locale = document.querySelector('#homeLocale').innerHTML.trim()

export const Date = props =>
  <FormGroup {...props}>
    <DatePicker
      {...props.input}
      id={props.input.name}
      className="form-control"
      selected={props.input.value ? moment.utc(props.input.value) : null}
      minDate={moment.utc()}
      locale={locale}
      onChange={date => props.input.onChange(moment.utc(date).format())}
      onBlur={() => {}}
    />
  </FormGroup>

Date.propTypes = {
  input: T.shape({
    name: T.string.isRequired,
    onChange: T.func.isRequired,
    value: T.string
  })
}

export const CollapsibleSection = props =>
  <div>
    {props.hidden &&
      <a role="button" onClick={props.toggle}>
        <span className="fa fa-caret-right"/>
        &nbsp;{props.showText}
      </a>
    }
      <Collapse in={!props.hidden}>
        <div>
          {props.children}
          <a role="button" onClick={props.toggle}>
            <span className="fa fa-caret-right"/>
            &nbsp;{props.hideText}
          </a>
        </div>
      </Collapse>
  </div>

CollapsibleSection.propTypes = {
  hidden: T.bool.isRequired,
  showText: T.string.isRequired,
  hideText: T.string.isRequired,
  toggle: T.func.isRequired,
  children: T.oneOfType([T.object, T.array]).isRequired
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