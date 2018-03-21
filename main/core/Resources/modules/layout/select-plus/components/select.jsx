import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {classNames} from '#/main/core/scaffolding/classnames'
import {Option} from '#/main/core/layout/select-plus/components/option.jsx'
import {Optgroup}  from '#/main/core/layout/select-plus/components/optgroup.jsx'

class Select extends Component {
  constructor(props) {
    super(props)
    this.state = {collapsed: true}
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnClick  = this.handleOnClick.bind(this)
    this.collapse = this.collapse.bind(this)
  }
  
  handleOnChange(newValue, event) {
    if (this.props.value !== newValue) {
      this.props.onChange(newValue)
    }
    event.preventDefault()
    event.stopPropagation()
  }
  
  handleOnClick(event) {
    this.setState({collapsed: !this.state.collapsed})
    event.preventDefault()
    event.stopPropagation()
  }
  
  collapse() {
    this.setState({collapsed: true})
  }
  
  render() {
    const props = this.props
    return (
      <div
        value={props.value}
        className={classNames('form-control input-sm select-plus', props.className)}
        onClick={this.handleOnClick}
        tabIndex={0}
        onBlur={this.collapse}
      >
        <div
          className="select-plus-value"
        >
          {props.value}
        </div>
        <div
          className={classNames('select-plus-options', this.state.collapsed ? 'hidden' : '')}
        >
        {props.choices.map(choice =>(
          choice.choices.length < 1 ?
            <Option
              key={choice.value}
              value={choice.value}
              label={choice.label}
              transDomain={props.transDomain}
              onSelect={this.handleOnChange}
            /> :
            <Optgroup
              key={choice.value}
              label={choice.label}
              choices={choice.choices}
              transDomain={props.transDomain}
              onSelect={this.handleOnChange}
            />
        ))}
        </div>
      </div>
    )
  }
}

Select.propTypes = {
  choices: T.array.isRequired,
  onChange: T.func.isRequired,
  value: T.any,
  className: T.string,
  transDomain: T.string
}

Select.defaultProps = {
  transDomain: null,
  value: ''
}

export {
  Select
}