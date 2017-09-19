import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {transChoice} from '#/main/core/translation'

import {constants as listConst} from '#/main/core/layout/list/constants'
import {constants as paginationConst} from '#/main/core/layout/pagination/constants'

import {DataAction, DataProperty} from '#/main/core/layout/list/prop-types'
import {
  createListDefinition,
  getDisplayableProps,
  getDisplayedProps,
  getFilterableProps
} from '#/main/core/layout/list/utils'

import {ListHeader} from '#/main/core/layout/list/components/header.jsx'
import {Pagination} from '#/main/core/layout/pagination/components/pagination.jsx'

const EmptyList = props =>
  <div className="list-empty">
    {props.hasFilters ?
      'No results found. Try to change your filters' :
      'No results found.'
    }
  </div>

EmptyList.propTypes = {
  hasFilters: T.bool
}

EmptyList.defaultProps = {
  hasFilters: false
}

/**
 * Full data list with configured components (eg. search, pagination).
 *
 * @param props
 * @constructor
 */
class DataList extends Component {
  constructor(props) {
    super(props)

    // adds missing default in the definition
    this.definition = createListDefinition(this.props.definition)

    // enables selected display mode
    this.setDisplayMode(this.props.display ? this.props.display.current : listConst.DEFAULT_DISPLAY_MODE, true)

    this.setDisplayMode = this.setDisplayMode.bind(this)
    this.toggleColumn   = this.toggleColumn.bind(this)
  }

  /**
   * Changes the list display.
   *
   * @param {string}  displayMode - the new display mode
   * @param {boolean} init        - a flag to know how we need to update state
   */
  setDisplayMode(displayMode, init = false) {
    let currentColumns
    if (listConst.DISPLAY_MODES[displayMode].filterColumns) {
      // gets only the displayed columns
      currentColumns = getDisplayedProps(this.definition)
    } else {
      // gets all displayable columns
      currentColumns = getDisplayableProps(this.definition)
    }

    const newState = {
      currentColumns: currentColumns.map(prop => prop.name),
      currentDisplay: displayMode
    }

    if (init) {
      this.state = newState
    } else {
      this.setState(newState)
    }
  }

  /**
   * Displays/Hides a data property in display modes that support it.
   *
   * @param {string} column - the name of the column to toggle
   */
  toggleColumn(column) {
    // Display/Hide columns is only available for display modes that support it (aka tables)
    if (listConst.DISPLAY_MODES[this.state.currentDisplay].filterColumns) {
      const newColumns = this.state.currentColumns.slice(0)

      // checks if the column is displayed
      const pos = newColumns.indexOf(column)
      if (-1 === pos) {
        // column is not displayed, display it
        newColumns.push(column)
      } else {
        // column is displayed, hide it
        newColumns.splice(pos, 1)
      }

      // updates displayed column list
      this.setState({currentColumns: newColumns})
    }
  }

  render() {
    // enables and configures list tools
    let displayTool
    if (1 < this.props.display.available.length) {
      displayTool = {
        current: this.state.currentDisplay,
        available: this.props.display.available,
        onChange: this.setDisplayMode.bind(this)
      }
    }

    let columnsTool
    if (listConst.DISPLAY_MODES[this.state.currentDisplay].filterColumns) {
      const displayableColumns = getDisplayableProps(this.definition)
      if (1 < displayableColumns.length) {
        columnsTool = {
          current: this.state.currentColumns,
          available: getDisplayableProps(this.definition),
          toggle: this.toggleColumn.bind(this)
        }
      }
    }

    let filtersTool
    if (this.props.filters) {
      filtersTool = Object.assign({}, this.props.filters, {
        available: getFilterableProps(this.definition)
      })
    }

    return (
      <div className="data-list">
        <ListHeader
          display={displayTool}
          columns={columnsTool}
          filters={filtersTool}
        />

        {0 < this.props.totalResults &&
          React.createElement(listConst.DISPLAY_MODES[this.state.currentDisplay].component, {
            size:      listConst.DISPLAY_MODES[this.state.currentDisplay].size,
            data:      this.props.data,
            count:     this.props.totalResults,
            columns:   this.definition.filter(prop => -1 !== this.state.currentColumns.indexOf(prop.name)),
            sorting:   this.props.sorting,
            selection: this.props.selection,
            actions:   this.props.actions
          })
        }

        {0 === this.props.totalResults &&
          <EmptyList hasFilters={this.props.filters && 0 < this.props.filters.current.length} />
        }

        <div className="list-footer">
          <div className="count">
            {transChoice('list_results_count', this.props.totalResults, {count: this.props.totalResults}, 'platform')}
          </div>

          {(this.props.pagination && paginationConst.AVAILABLE_PAGE_SIZES[0] < this.props.totalResults) &&
            <Pagination
              {...this.props.pagination}
              totalResults={this.props.totalResults}
            />
          }
        </div>
      </div>
    )
  }
}

DataList.propTypes = {
  /**
   * The data list to display.
   */
  data: T.arrayOf(T.shape({
    // because some features (like selection) requires to retrieves some data rows
    id: T.oneOfType([T.string, T.number]).isRequired
  })).isRequired,

  /**
   * Total results available in the list (without pagination if any).
   */
  totalResults: T.number.isRequired,

  /**
   * Definition of the data properties.
   */
  definition: T.arrayOf(
    T.shape(DataProperty.propTypes)
  ).isRequired,

    /**
     * Label of the property
     */
    label: T.string.isRequired,

    /**
     * Configuration flags (default: LIST_PROP_DEFAULT).
     * Permits to define if the prop is sortable, filterable, displayable, etc.
     */
    flags: T.number,

    /**
     * A custom renderer if the default one from `type` does not fit your needs.
     */
    renderer: T.func,

    /**
     * An option object in case this is much more complex than anticipated
     */
    options: T.object
  })).isRequired,

  /**
   * Display formats of the list.
   * Providing this object automatically display the display formats component.
   */
  display: T.shape({
    /**
     * Available formats.
     */
    available: T.arrayOf(
      T.oneOf(Object.keys(listConst.DISPLAY_MODES))
    ).isRequired,

    /**
     * Current format.
     */
    current: T.oneOf(Object.keys(listConst.DISPLAY_MODES)).isRequired
  }),

  /**
   * Search filters configuration.
   * Providing this object automatically display the search box component.
   */
  filters: T.shape({
    current: T.arrayOf(T.shape({
      property: T.string.isRequired,
      value: T.any.isRequired
    })).isRequired,
    addFilter: T.func.isRequired,
    removeFilter: T.func.isRequired
  }),

  /**
   * Sorting configuration.
   * Providing this object automatically display data sorting components.
   */
  sorting: T.shape({
    current: T.shape({
      property: T.string,
      direction: T.number
    }).isRequired,
    updateSort: T.func.isRequired
  }),

  /**
   * Pagination configuration.
   * Providing this object automatically display pagination and results per page components.
   */
  pagination: T.shape({
    current: T.number,
    pageSize: T.number.isRequired,
    changePage: T.func.isRequired,
    updatePageSize: T.func.isRequired
  }),

  /**
   * Selection configuration.
   * Providing this object automatically display select checkboxes for each data results.
   */
  selection: T.shape({
    current: T.array.isRequired,
    toggle: T.func.isRequired,
    toggleAll: T.func.isRequired
  }),

  /**
   * Actions available for each data row and selected rows (if selection is enabled).
   */
  actions: T.arrayOf(
    T.shape(DataAction.propTypes)
  )
}

DataList.defaultProps = {
  actions: [],
  display: {
    available: Object.keys(listConst.DISPLAY_MODES),
    current: listConst.DEFAULT_DISPLAY_MODE
  }
}

export {
  DataList
}
