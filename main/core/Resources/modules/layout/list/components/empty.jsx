import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

const ListEmpty = props =>
  <div className="list-empty">
    {t(props.hasFilters ? 'list_search_no_results' : 'list_no_results')}
  </div>

ListEmpty.propTypes = {
  hasFilters: T.bool
}

ListEmpty.defaultProps = {
  hasFilters: false
}

export {
  ListEmpty
}
