import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
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
 */
class DataList extends Component {
  constructor(props) {
    super(props)

    if (this.props.fetch && this.props.fetch.autoload) {
      // todo find better
      this.props.fetchData()
    }
  }

  render() {
    return (
      <DataListComponent
        {...this.props}
      />
    )
  }
}

DataList.propTypes = {
  /**
   * The name of the data in the list.
   *
   * It should be the key in the store where the list has been mounted
   * (aka where `makeListReducer()` has been called).
   */
  name: T.string.isRequired,

  /**
   * Provides asynchronous data load.
   */
  fetch: T.shape({
    url: T.string.isRequired,
    autoload: T.bool
  }),

  /**
   * Provides data delete.
   */
  delete: T.shape({
    url: T.string, // if provided, data delete will call server
    disabled: T.func, // receives the list of rows (either the selected ones or the current one)
    displayed: T.func // receives the list of rows (either the selected ones or the current one)
  }),

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

  /**
   * Override default list translations.
   */
  translations: T.shape({
    domain: T.string,
    keys: T.shape({
      searchPlaceholder: T.string,
      emptyPlaceholder: T.string,
      countResults: T.string,
      deleteConfirm: T.string,
      deleteConfirmMessage: T.string
    })
  }),

  // calculated from redux store
  data: T.array.isRequired,
  totalResults: T.number.isRequired,
  filters: T.object,
  sorting: T.object,
  pagination: T.object,
  selection: T.object,
  deleteItems: T.func,
  fetchData: T.func
}

DataList.defaultProps = {
  actions: []
}

// connect list to redux
const DataListContainer = connectList()(DataList)

export {
  DataListContainer
}
