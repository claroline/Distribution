import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {Option} from '#/main/core/layout/select-plus/components/option.jsx'

class Optgroup extends Component {
  render() {
    const props = this.props
    return (
      <optgroup  label={props.transDomain ? trans(props.label, {}, props.transDomain) : props.label}>
        {props.choices.map(choice =>(
          choice.choices.length < 1 ?
            <Option key={choice.value} value={choice.value} label={choice.label} transDomain={props.transDomain}/> :
            <Optgroup key={choice.value} label={choice.label} choices={choice.choices} transDomain={props.transDomain}/>
        ))}
      </optgroup>
    )
  }
}

Optgroup.propTypes = {
  choices: T.array.isRequired,
  label: T.string.isRequired,
  transDomain: T.string
}

Optgroup.defaultProps = {
  transDomain: null
}

export {
  Optgroup
}