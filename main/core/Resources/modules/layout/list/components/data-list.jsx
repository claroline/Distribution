import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {transChoice} from '#/main/core/translation'

import {LIST_DISPLAY_LIST} from '#/main/core/layout/list/default'
import {Pagination} from '#/main/core/layout/pagination/components/pagination.jsx'
import {ListHeader} from '#/main/core/layout/list/components/header.jsx'

import {DataTable} from '#/main/core/layout/data/components/data-table.jsx'
import {DataGrid} from '#/main/core/layout/data/components/data-grid.jsx'

import {
  getListDisplay,
  getDisplayableProps,
  getDisplayedProps,
  getFilterableProps,
  getSortableProps
} from '#/main/core/layout/list/utils'

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

const SelectedData = props =>
  <div className="selected-row">
    <span className="fa fa-fw fa-check-square" />
    <span
      dangerouslySetInnerHTML={{ __html: transChoice('elements_selected', props.count, {count: props.count})}}
    />
    <div className="selected-bulk-actions">
      {props.actions.map(action => typeof action.action === 'function' ?
        <button
          className="btn btn-link"
          onClick={action.action}
        >
          <span className={action.icon} />
          <span className="sr-only">{action.label}</span>
        </button>
        :
        <a
          className="btn btn-link"
          href={action.action}
        >
          <span className={action.icon} />
          <span className="sr-only">{action.label}</span>
        </a>
      )}
    </div>
  </div>

SelectedData.propTypes = {
  count: T.number.isRequired,
  actions: T.arrayOf(T.shape({
    label: T.string,
    icon: T.string,
    action: T.oneOfType([T.string, T.func]).isRequired
  })).isRequired
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

    this.state = {
      currentColumns: getDisplayedProps(this.props.definition).map(prop => prop.name),
      currentDisplay: this.props.display ? this.props.display.current : LIST_DISPLAY_LIST[0]
    }
  }

  getDataRepresentation() {
    if (LIST_DISPLAY_LIST === getListDisplay(this.props.display.available, this.state.currentDisplay)) {
      return <DataTable data={this.props.data} columns={this.props.definition.filter(prop => -1 !== this.state.currentColumns.indexOf(prop.name))} />
    } else {
      return <DataGrid data={this.props.data} />
    }
  }

  toggleColumn(column) {
    const newColumns = this.state.currentColumns.slice(0);
    const pos = newColumns.indexOf(column)
    if (-1 === pos) {
      newColumns.push(column)
    } else {
      newColumns.splice(pos, 1)
    }

    this.setState({
      currentColumns: newColumns
    })
  }

  render() {
    return (
      <div className="data-list">
        <ListHeader
          display={Object.assign({}, this.props.display, {
            current: this.state.currentDisplay,
            onChange: (display) => this.setState({currentDisplay: display})
          })}
          columns={{
            current: this.state.currentColumns,
            available: getDisplayableProps(this.props.definition),
            toggle: this.toggleColumn.bind(this)
          }}
          filters={Object.assign({
            available: getFilterableProps(this.props.definition)
          }, this.props.filters)}
        />

        {0 === this.props.totalResults &&
          <EmptyList hasFilters={this.props.filters && 0 < this.props.filters.current.length} />
        }

        {0 < this.props.totalResults &&
          this.getDataRepresentation()
        }

        {(0 < this.props.totalResults && this.props.pagination) &&
          <Pagination
            totalResults={this.props.totalResults}
            {...this.props.pagination}
          />
        }
      </div>
    )
  }
}

DataList.propTypes = {
  /**
   * The data list to display.
   */
  data: T.array.isRequired,

  /**
   * Definition of the data properties.
   */
  definition: T.arrayOf(T.shape({
    /**
     * Name of the property
     */
    name: T.string.isRequired,

    /**
     * Default data prop type (default: string).
     */
    type: T.string,

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
    renderer: T.func
  })).isRequired,

  /**
   * Display formats of the list.
   * Providing this object automatically display the display formats component.
   */
  display: T.shape({
    /**
     * Available formats.
     */
    available: T.array.isRequired,
    /**
     * Current format.
     */
    current: T.string.isRequired
  }),

  /**
   * Total results available in the list.
   */
  totalResults: T.number.isRequired,

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
   * Pagination configuration.
   * Providing this object automatically display pagination and results per page components.
   */
  pagination: T.shape({
    current: T.number,
    pageSize: T.number.isRequired,
    handlePageChange: T.func.isRequired,
    handlePageSizeUpdate: T.func.isRequired
  }),

  /**
   * Selection configuration
   * Providing this object automatically display select checkboxes for each data results.
   */
  selection: T.shape({
    current: T.array,
    toggle: T.func.isRequired,
    toggleAll: T.func.isRequired,
    actions: T.arrayOf(T.shape({
      label: T.string,
      icon: T.string,
      action: T.oneOfType([T.string, T.func]).isRequired
    })).isRequired
  })
}

export {
  DataList
}
