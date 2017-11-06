import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {DataSearch as DataSearchTypes} from '#/main/core/layout/data/prop-types'

const EnumSearch = (props) =>
  <span className="enum-filter">
    <select
      value={props.search}
      className="form-control input-sm"
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onChange={e => {
        props.updateSearch(props.options.choices[e.target.value])
        e.preventDefault()
      }}
    >
      <option />
      {Object.keys(props.options.choices).map(value =>
        <option key={value} value={value}>{props.options.choices[value]}</option>
      )}
    </select>
  </span>

EnumSearch.propTypes = merge({}, DataSearchTypes.propTypes, {
  choices: T.object.isRequired
})

export {
  EnumSearch
}
