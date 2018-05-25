import {connect} from 'react-redux'
import invariant from 'invariant'
import isEqual from 'lodash/isEqual'

import {trans, transChoice} from '#/main/core/translation'

import {actions as listActions} from '#/main/core/data/list/actions'
import {select as listSelect} from '#/main/core/data/list/selectors'

/**
 * Gets list data and config from redux store.
 *
 * NB. we will enable list features based on what we find in the store.
 *
 * @param {object} state
 * @param {object} ownProps
 *
 * @returns {object}
 */
function mapStateToProps(state, ownProps) {
  // get the root of the list in the store
  const listState = listSelect.list(state, ownProps.name)

  invariant(undefined !== listState, `Try to connect list on undefined store '${ownProps.name}'.`)

  const newProps = {
    loaded: listSelect.loaded(listState),
    invalidated: listSelect.invalidated(listState),
    data: listSelect.data(listState),
    totalResults: listSelect.totalResults(listState)
  }

  // grab data for optional features
  newProps.filterable = listSelect.isFilterable(listState)
  if (newProps.filterable) {
    newProps.filters = listSelect.filters(listState)
  }

  newProps.sortable = listSelect.isSortable(listState)

  if (listState.readOnly) {
    newProps.readOnly = listState.readOnly
  }

  if (newProps.sortable) {
    newProps.sortBy = listSelect.sortBy(listState)
  }

  newProps.selectable = listSelect.isSelectable(listState)
  if (newProps.selectable) {
    newProps.selected = listSelect.selected(listState)
  }

  newProps.paginated = listSelect.isPaginated(listState)
  if (newProps.paginated) {
    newProps.pageSize    = listSelect.pageSize(listState)
    newProps.currentPage = listSelect.currentPage(listState)
  }

  return newProps
}

/**
 * Injects list actions.
 * NB. we inject all list actions, `mergeProps` will only pick the one for enabled features.
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
    fetchData(url) {
      // return the async promise
      return dispatch(listActions.fetchData(ownProps.name, url))
    },
    invalidateData() {
      dispatch(listActions.invalidateData(ownProps.name))
    },

    // filtering
    addFilter(property, value) {
      dispatch(listActions.addFilter(ownProps.name, property, value))
    },
    removeFilter(filter) {
      dispatch(listActions.removeFilter(ownProps.name, filter))
    },

    // sorting
    updateSort(property) {
      dispatch(listActions.updateSort(ownProps.name, property))
    },

    // selection
    toggleSelect(id, action = 'select') {
      dispatch(listActions.toggleSelect(ownProps.name, id, action))
    },
    toggleSelectAll(items) {
      dispatch(listActions.toggleSelectAll(ownProps.name, items))
    },

    // pagination
    updatePageSize(pageSize) {
      dispatch(listActions.updatePageSize(ownProps.name, pageSize))
    },
    changePage(page) {
      dispatch(listActions.changePage(ownProps.name, page))
    },

    // delete
    deleteItems(items) {
      if (ownProps.delete.url) {
        dispatch(listActions.deleteData(ownProps.name, ownProps.delete.url, items))
      } else {
        dispatch(listActions.deleteItems(ownProps.name, items))
      }
    }
  }
}

/**
 * Generates the final container props based on store available data.
 * For async lists, It also adds async calls to list actions that require data refresh.
 *
 * @param {object} stateProps    - the injected store data
 * @param {object} dispatchProps - the injected store actions
 * @param {object} ownProps      - the props passed to the react components
 *
 * @returns {object} - the final props object that will be passed to DataList container
 */
function mergeProps(stateProps, dispatchProps, ownProps) {
  const asyncDecorator = (func) => {
    if (ownProps.fetch) {
      return (...args) => {
        // call original action
        func.apply(null, args)

        // refresh list
        dispatchProps.invalidateData()
      }
    }

    return func
  }

  const props = {
    fetchData: dispatchProps.fetchData,

    level:         ownProps.level,
    displayLevel:  ownProps.displayLevel,
    title:         ownProps.title,
    name:          ownProps.name,
    fetch:         ownProps.fetch,
    definition:    ownProps.definition,
    card:          ownProps.card,
    filterColumns: ownProps.filterColumns,
    display:       ownProps.display,
    translations:  ownProps.translations,
    readOnly:      stateProps.readOnly,
    loaded:        stateProps.loaded,
    invalidated:   stateProps.invalidated,
    data:          stateProps.data,
    totalResults:  stateProps.totalResults
  }

  // Data actions
  props.primaryAction = ownProps.primaryAction

  // create the final list of actions
  // merge standard actions with the delete one
  props.actions = (rows) => {
    let actions = []

    if (ownProps.actions) {
      actions = actions.concat(
        ownProps.actions(rows)
      )
    }

    if (ownProps.delete) {
      actions = actions.concat([{
        type: 'callback',
        icon: 'fa fa-fw fa-trash-o',
        label: trans('delete', {}, 'actions'),
        dangerous: true,
        confirm: {
          title: trans('objects_delete_title'),
          message: transChoice('objects_delete_question', rows.length, {count: rows.length}),
          button: trans('delete', {}, 'actions')
        },
        disabled: undefined !== ownProps.delete.disabled && ownProps.delete.disabled(rows),
        displayed: undefined === ownProps.delete.displayed || ownProps.delete.displayed(rows),
        callback: () => dispatchProps.deleteItems(rows)
      }])
    }

    return actions
  }

  // optional list features
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

/**
 * Connects a list component to the store.
 *
 * @returns {function}
 */
function connectList() {
  return (ListComponent) => connect(mapStateToProps, mapDispatchToProps, mergeProps, {
    // the default behavior is to use shallow comparison
    // but as I create new objects in `mergeProps`, the comparison always returns false
    // and cause recomputing
    areMergedPropsEqual: (next, prev) => isEqual(next, prev)
  })(ListComponent)
}

export {
  connectList
}
