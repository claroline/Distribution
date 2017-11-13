import React from 'react'
import {PropTypes as T} from 'prop-types'

import {connectList} from '#/main/core/layout/list/connect'

import {
  DataAction as DataActionTypes,
  DataListProperty as DataListPropertyTypes
} from '#/main/core/layout/list/prop-types'
import {DataList as DataListComponent} from '#/main/core/layout/list/components/data-list.jsx'

/**
 * Connected DataList.
 *
 * It automatically displays list features registered in the store (@see makeListReducer()).
 * It can also performs API calls to refresh data if configured to.
 *
 * @param props
 * @constructor
 */
const DataList = props =>  <DataListComponent {...props} />

DataList.propTypes = {
  /**
   * The name of the data in the list.
   *
   * It should be the key in the store where the list has been mounted
   * (aka where `makeListReducer()` has been called).
   */
  name: T.string.isRequired,

  fetchUrl: T.string,

  /**
   * The definition of the list rows data.
   */
  definition: T.arrayOf(
    T.shape(DataListPropertyTypes.propTypes)
  ).isRequired,

  /**
   * A list of data related actions.
   */
  actions: T.arrayOf(
    T.shape(DataActionTypes.propTypes)
  ),

  /**
   * A function to normalize data for card display.
   * - the data row is passed as argument
   * - the func MUST return an object respecting `DataCard.propTypes`.
   *
   * It's required to enable cards based display modes.
   */
  card: T.func.isRequired,

  /**
   * Enables/Disables the feature to filter the displayed columns.
   */
  filterColumns: T.bool,

  // calculated from redux store
  data: T.array.isRequired,
  totalResults: T.number.isRequired,
  filters: T.object,
  sorting: T.object,
  pagination: T.object,
  selection: T.object
}

// connect list to redux
const DataListContainer = connectList()(DataList)

export {
  DataListContainer
}
