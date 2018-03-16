import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {Option} from '#/main/core/layout/select-plus/components/option.jsx'
import {Optgroup}  from '#/main/core/layout/select-plus/components/optgroup.jsx'

class Select extends Component {
  render() {
    const props = this.props
    return (
      <select
        value={props.value}
        className="form-control input-sm select-plus"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onChange={e => {
          const val = e.target.value
          props.onChange(val)
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {props.choices.map(choice =>(
          choice.choices.length < 1 ?
            <Option key={choice.value} value={choice.value} label={choice.label} transDomain={props.transDomain}/> :
            <Optgroup key={choice.value} label={choice.label} choices={choice.choices} transDomain={props.transDomain}/>
        ))}
      </select>
    )
  }
}

Select.propTypes = {
  choices: T.array.isRequired,
  onChange: T.func.isRequired,
  value: T.any,
  transDomain: T.string
}

Select.defaultProps = {
  transDomain: null,
  value: ''
}

export {
  Select
}