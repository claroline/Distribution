import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const EnumSearch = (props) => {
  return (
    <span className="enum-filter">
      {props.isValid &&
        <span className="available-filter-value">{props.search}</span>
      }

      {Object.keys(props.options.enum).forEach(key => {
        return (
          <button
            type="button"
            className={classes('btn btn-sm')}
            onClick={() => props.updateSearch(props.options.enum[key])}
          >
            <span>{key}</span>
          </button>
        )
      })}
    </span>
  )
}

EnumSearch.propTypes = {
  search: T.string.isRequired,
  isValid: T.bool.isRequired,
  updateSearch: T.func.isRequired,
  options: T.object.isRequired
}

export {EnumSearch}
