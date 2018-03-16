import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'

class Option extends Component {
  render() {
    const props = this.props
    return (
      <option value={props.value}>
        { props.transDomain ?
          trans(props.label, {}, props.transDomain) :
          props.label
        }
        </option>
    )
  }
}

Option.propTypes = {
  label: T.string.isRequired,
  value: T.any.isRequired,
  transDomain: T.string
}

Option.defaultProps = {
  transDomain: null
}

export {
  Option
}