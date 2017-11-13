import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import {t} from '#/main/core/translation'

import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {actions as listActions} from '#/main/core/layout/list/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'

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

  const newProps = {
    data: listSelect.data(listState),
    totalResults: listSelect.totalResults(listState),
    queryString: listSelect.queryString(listState)
  }

  // grab data for optional features
  newProps.deletable = listSelect.isDeletable(listState)
  if (newProps.deletable) {
    newProps.modalDeleteTitle = listSelect.modalDeleteTitle(listState)
    newProps.modalDeleteQuestion = listSelect.modalDeleteQuestion(listState)
    newProps.displayDelete = listSelect.displayDelete(listState)
  }

  newProps.filterable = listSelect.isFilterable(listState)
  if (newProps.filterable) {
    newProps.filters = listSelect.filters(listState)
  }

  newProps.sortable = listSelect.isSortable(listState)
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
 * Injects store actions based on the list config.
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
    fetchData() {
      dispatch(listActions.fetchData(ownProps.name, ownProps.fetchUrl))
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
    toggleSelect(id) {
      dispatch(listActions.toggleSelect(ownProps.name, id))
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
    deleteItems(items, title, question, async) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title,
          question,
          handleConfirm: () => {
            async ?
              dispatch(listActions.asyncDeleteItems(ownProps.name, items)):
              dispatch(listActions.deleteItems(ownProps.name, items))
          }
        })
      )
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
    if (!!ownProps.fetchUrl) {
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
    name:          ownProps.name,
    definition:    ownProps.definition,
    fetchUrl:      ownProps.fetchUrl,
    data:          stateProps.data,
    totalResults:  stateProps.totalResults,
    actions:       ownProps.actions,
    card:          ownProps.card,
    queryString:   stateProps.queryString,
    filterColumns: ownProps.filterColumns,
    display:       ownProps.display
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

  if (stateProps.deletable) {
    const actions = cloneDeep(props.actions)

    actions.push({
      icon: 'fa fa-fw fa-trash-o',
      label: t('delete'),
      action: (rows) => dispatchProps.deleteItems(
        rows,
        stateProps.modalDeleteTitle(rows),
        stateProps.modalDeleteQuestion(rows),
        !!ownProps.fetchUrl
      ),
      dangerous: true,
      displayed: (rows) => stateProps.displayDelete(rows)
    })
    props.actions = actions
  }

  return props
}

/**
 * Connects a list component to the store.
 *
 * @returns {function}
 */
function connectList() {
  return (ListComponent) => connect(mapStateToProps, mapDispatchToProps, mergeProps)(ListComponent)
}

export {
  connectList
}
