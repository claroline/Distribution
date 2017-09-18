import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {constants} from '#/main/core/layout/list/constants'

import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'

import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'

import {DataAction, DataProperty} from '#/main/core/layout/list/prop-types'
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
class DataList extends Component {
  constructor(props) {
    super(props)

    console.log(window.location)
  }

  render() {
    return (
      <DataListComponent
        data={this.props.data}
        totalResults={this.props.totalResults}
        definition={this.props.definition}
        actions={this.props.actions}
        filters={this.props.filters}
        sorting={this.props.sorting}
        selection={this.props.selection}
        pagination={this.props.pagination}
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

  // from DataList
  data: T.array.isRequired,
  totalResults: T.number.isRequired,
  definition: T.arrayOf(
    T.shape(DataProperty.propTypes)
  ).isRequired,

  actions: T.arrayOf(
    T.shape(DataAction.propTypes)
  ),

  // list features
  filters: T.object,
  sorting: T.object,
  pagination: T.object,
  selection: T.object
}

/**
 * Injects store values inside component based on the list config.
 * Only data for enabled features are injected.
 *
 * @param {object} state
 * @param {object} ownProps
 *
 * @returns {object}
 */
function mapStateToProps(state, ownProps) {
  // get the root of the list in the store
  const listState = state[ownProps.name]

  const newProps = {
    data: listSelect.data(listState),
    totalResults: listSelect.totalResults(listState),
    async: listSelect.isAsync(listState),
    queryString: listSelect.queryString(listState)
  }

  // grab data for optional features
  if (newProps.filterable = listSelect.isFilterable(listState)) {
    newProps.filters = listSelect.filters(listState)
  }

  if (newProps.sortable = listSelect.isSortable(listState)) {
    newProps.sortBy = listSelect.sortBy(listState)
  }

  if (newProps.selectable = listSelect.isSelectable(listState)) {
    newProps.selected = listSelect.selected(listState)
  }

  if (newProps.paginated = listSelect.isPaginated(listState)) {
    newProps.pageSize    = paginationSelect.pageSize(listState)
    newProps.currentPage = paginationSelect.current(listState)
  }

  return newProps
}

/**
 * Injects store actions based on the list config.
 * Only actions for enabled features are injected.
 *
 * @param {function} dispatch
 * @param {object}   ownProps
 *
 * @returns {object}
 */
function mapDispatchToProps(dispatch, ownProps) {
  // we inject all list actions, the `mergeProps` function will filter it
  // based on the enabled features.
  return {
    // async
    fetchData() {
      dispatch(listActions.fetchData(ownProps.name))
    },
    // filtering
    addFilter(property, value) {
      dispatch(listActions.addFilter(property, value))
    },
    removeFilter(filter) {
      dispatch(listActions.removeFilter(filter))
    },
    // sorting
    updateSort(property) {
      dispatch(listActions.updateSort(property))
    },
    // selection
    toggleSelect(id) {
      dispatch(listActions.toggleSelect(id))
    },
    toggleSelectAll(items) {
      dispatch(listActions.toggleSelectAll(items))
    },
    // pagination
    updatePageSize(pageSize) {
      dispatch(paginationActions.updatePageSize(pageSize))
    },
    changePage(page) {
      dispatch(paginationActions.changePage(page))
    }
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const asyncDecorator = (func) => {
    if (stateProps.async) {
      return (...args) => {
        // call original action
        func.apply(null, args)

        // refresh list
        dispatchProps.fetchData()
      }
    }

    return func
  }

  const props = {
    name: ownProps.name,
    definition: ownProps.definition,
    data: stateProps.data,
    totalResults: stateProps.totalResults,
    actions: ownProps.actions,
    queryString: stateProps.queryString
  }

  if (stateProps.filterable) {
    props.filters = {
      current: stateProps.filters,
      addFilter: asyncDecorator(dispatchProps.addFilter),
      removeFilter: asyncDecorator(dispatchProps.removeFilter)
    }
  }

  if (stateProps.sortable) {
    props.sorting = {
      current: stateProps.sortBy,
      updateSort: asyncDecorator(dispatchProps.updateSort)
    }
  }

  if (stateProps.selectable) {
    props.selection = {
      current: stateProps.selected,
      toggle: dispatchProps.toggleSelect,
      toggleAll: dispatchProps.toggleSelectAll
    }
  }

  if (stateProps.paginated) {
    props.pagination = {
      pageSize: stateProps.pageSize,
      current: stateProps.currentPage,
      changePage: asyncDecorator(dispatchProps.changePage),
      updatePageSize: asyncDecorator(dispatchProps.updatePageSize)
    }
  }

  return props
}

const DataListContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(DataList)

export {
  DataListContainer
}
