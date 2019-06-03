import {createElement, Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'

import {makeCancelable} from '#/main/app/api'
import {getType} from '#/main/app/data/types'

import {FormGroup} from '#/main/app/content/form/components/group'
import {validateProp} from '#/main/app/content/form/validator'

// todo : add loading placeholder
// todo : better error handling on undefined types

class DataInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      loaded: false,
      input: null,
      group: null
    }

    this.onChange = this.onChange.bind(this)
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return {
      error: true,
      loaded: true
    }
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      this.load()
    }
  }

  componentWillUnmount() {
    if (this.pending) {
      this.pending.cancel()
      this.pending = null
    }
  }

  load() {
    if (this.pending) {
      this.pending.cancel()
      this.pending = null
    }

    this.pending = makeCancelable(
      Promise.all([
        this.props.type ? getType(this.props.type) : Promise.resolve({}),
        validateProp(this.props, this.props.value)
      ])
    )

    this.pending.promise
      .then(
        (result = []) => {
          if (this.props.onError && !isEmpty(result[1])) {
            // forward error to the caller
            this.props.onError(result[1])
          }

          this.setState({
            loaded: true,
            group: get(result[0], 'components.group'),
            input: get(result[0], 'components.input')
          })
        }
      )
      .then(
        () => this.pending = null,
        () => this.pending = null
      )
  }

  onChange(value) {
    // validate new value
    if (this.props.onError) {
      validateProp(this.props, value).then(errors => {
        // forward error to the caller
        this.props.onError(errors)
      })
    }

    // forward updated value to the caller
    return this.props.onChange(value)
  }

  renderInput() {
    if (!this.state.loaded) {
      // todo : better
      return 'loading'
    }

    if (this.state.error) {
      // todo : better
      return 'error'
    }

    if (this.props.children) {
      return this.props.children
    }

    if (this.props.render) {
      return this.props.render(this.props.value, this.props.error)
    }

    if (this.state.input) {
      return createElement(this.state.input,
        // the props to pass to the input
        merge({}, this.props.options, {
          id: this.props.id,
          label: this.props.label,
          value: this.props.value,
          error: this.props.error,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled,
          size: this.props.size,
          onChange: this.onChange
        })
      )
    }
  }

  render() {
    // the group component to create
    return createElement(this.state.group || FormGroup,
      // the props to pass to the group
      {
        id: this.props.id,
        label: this.props.label,
        hideLabel: this.props.hideLabel,
        help: this.props.help,
        error: this.props.error,
        optional: !this.props.required,
        warnOnly: !this.props.validating
      },
      this.renderInput()
    )
  }
}

DataInput.propTypes = {
  id: T.string.isRequired,
  type: T.string,
  label: T.string.isRequired,
  hideLabel: T.bool,
  options: T.object, // depends on the data type
  help: T.oneOfType([T.string, T.arrayOf(T.string)]),
  placeholder: T.any, // depends on the data type
  size: T.oneOf(['sm', 'lg']),

  // field state
  required: T.bool,
  disabled: T.bool,
  validating: T.bool,

  // field data
  value: T.any, // depends on the data type
  error: T.oneOfType([
    T.string,
    T.arrayOf(T.string),
    T.object
  ]),

  // field callbacks
  onChange: T.func.isRequired,
  onError: T.func,
  validate: T.func,

  // customization
  // It will replace the render of the input.
  children: T.node
}

DataInput.defaultProps = {
  hideLabel: false,
  options: {},
  required: false,
  disabled: false,
  validating: false
}

export {
  DataInput
}
