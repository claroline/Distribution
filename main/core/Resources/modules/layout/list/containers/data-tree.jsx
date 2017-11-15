import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {connectList} from '#/main/core/layout/list/connect'

import {
  DataAction as DataActionTypes,
  DataListProperty as DataListPropertyTypes
} from '#/main/core/layout/list/prop-types'
import {DataTree as DataTreeComponent} from '#/main/core/layout/list/components/data-tree.jsx'

// todo there are big c/c from data-list

/**
 * Connected DataTree.
 *
 * It automatically displays list features registered in the store (@see makeListReducer()).
 * Counter to DataList, DataTree cannot handle the sortable and pagination features.
 *
 * @param props
 * @constructor
 */
class DataTree extends Component {
  constructor(props) {
    super(props)

    if (this.props.fetch && this.props.fetch.autoload) {
      // todo find better
      this.props.fetchData()
    }
  }

  render() {
    return (
      <DataTreeComponent {...this.props} />
    )
  }
}

DataTree.propTypes = {
  /**
   * The name of the data in the tree.
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

  // calculated from redux store
  data: T.array.isRequired,
  totalResults: T.number.isRequired,
  filters: T.object,
  selection: T.object
}

const DataTreeContainer = connectList()(DataTree)

export {
  DataTreeContainer
}
