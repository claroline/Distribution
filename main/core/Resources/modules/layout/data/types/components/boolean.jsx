import React from 'react'
import {PropTypes as T} from 'prop-types'

const BooleanSearch = props =>
  <span className="boolean-filter">
    <button type="button" className="btn btn-sm">
      <span className="fa fa-fw fa-check" />
    </button>
    &nbsp;
    <button type="button" className="btn btn-sm">
      <span className="fa fa-fw fa-times" />
    </button>
  </span>

BooleanSearch.propTypes = {
  search: T.string.isRequired,
  isValid: T.bool.isRequired,
  updateSearch: T.func.isRequired
}

export {BooleanSearch}
