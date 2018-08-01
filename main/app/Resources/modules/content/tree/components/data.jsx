import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'

import {
  createListDefinition,
  getPrimaryAction,
  getActions,
  getFilterableProps,
  isRowSelected
} from '#/main/app/content/list/utils'
import {DataCard as DataCardTypes} from '#/main/app/content/data/prop-types'
import {
  DataListProperty as DataListPropertyTypes,
  DataListSelection as DataListSelectionTypes,
  DataListSearch as DataListSearchTypes
} from '#/main/app/content/list/prop-types'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element'
import {Checkbox} from '#/main/core/layout/form/components/field/checkbox'
import {ListActions, ListPrimaryAction, ListBulkActions} from '#/main/app/content/list/components/actions'
import {ListEmpty} from '#/main/app/content/list/components/empty'
import {ListHeader} from '#/main/app/content/list/components/header'

// todo there are some big c/c from data-list
// todo maybe make it a list view
// todo reuse DataCard for display

const TreeDataItemContent = props =>
  <div className={classes('data-tree-item', props.computedData.className, {
    'expanded': props.expanded,
    'selected': props.selected,
    'data-tree-leaf': !props.hasChildren
  })}>
    {props.hasChildren &&
    <button
      type="button"
      className="btn btn-tree-toggle"
      onClick={props.toggle}
    >
        <span className={classes('fa fa-fw', {
          'fa-plus': !props.expanded,
          'fa-minus': props.expanded
        })} />
    </button>
    }

    <div className="data-tree-item-content">
      <div className="data-tree-item-label">
        {props.onSelect &&
        <input
          type="checkbox"
          className="data-tree-item-select"
          checked={props.selected}
          onChange={props.onSelect}
        />
        }

        <ListPrimaryAction
          action={props.primaryAction}
          className="item-title"
          disabledWrapper="h2"
        >
          {props.computedData.title}
          {props.computedData.subtitle &&
          <small key="item-subtitle">{props.computedData.subtitle}</small>
          }
        </ListPrimaryAction>

        {props.computedData.flags &&
        <div className="item-flags">
          {props.computedData.flags.map((flag, flagIndex) => flag &&
            <TooltipElement
              key={flagIndex}
              id={`item-${props.data.id}-flag-${flagIndex}`}
              tip={flag[1]}
            >
              <span className={classes('item-flag', flag[0])} />
            </TooltipElement>
          )}
        </div>
        }
      </div>

      {0 < props.actions.length &&
      <ListActions
        id={`actions-${props.data.id}`}
        actions={props.actions}
      />
      }

      {props.connectDragSource && props.connectDragSource(
        <span
          className="btn data-actions-btn btn-drag"
        >
          <span className="fa fa-fw fa-arrows" />
          <span className="sr-only">{trans('move')}</span>
        </span>
      )}
    </div>
  </div>

TreeDataItemContent.propTypes = {
  selected: T.bool.isRequired,
  expanded: T.bool.isRequired,
  hasChildren: T.bool.isRequired,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )).isRequired,
  primaryAction: T.shape(
    ActionTypes.propTypes
  ),
  data: T.shape({
    id: T.string
  }).isRequired,
  /**
   * Computed card data from row.
   */
  computedData: T.shape(
    DataCardTypes.propTypes
  ).isRequired,
  toggle: T.func,
  onSelect: T.func,

  connectDragSource: T.func
}

TreeDataItemContent.defaultProps = {
  selected: false
}

class TreeDataItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    return (
      <li className="data-tree-item-container">
        <TreeDataItemContent
          selected={isRowSelected(this.props.data, this.props.selected)}
          expanded={this.state.expanded}
          hasChildren={this.props.data.children && 0 < this.props.data.children.length}
          data={this.props.data}
          computedData={this.props.card(this.props.data)}
          actions={getActions([this.props.data], this.props.actions)}
          primaryAction={getPrimaryAction(this.props.data, this.props.primaryAction)}
          onSelect={this.props.onSelect ? () => this.props.onSelect(this.props.data) : undefined}
          toggle={() => this.toggle()}
        />

        {this.props.data.children && 0 < this.props.data.children.length &&
        <ul
          className="data-tree-children"
          style={{
            display: this.state.expanded ? 'block':'none'
          }}
        >
          {this.props.data.children.map((child) =>
            <TreeDataItem
              key={child.id}
              data={child}
              actions={this.props.actions}
              primaryAction={this.props.primaryAction}
              selected={this.props.selected}
              onSelect={this.props.onSelect}
              card={this.props.card}
            />
          )}
        </ul>
        }
      </li>
    )
  }
}

TreeDataItem.propTypes = {
  expanded: T.bool,
  selected: T.array,
  data: T.shape({
    id: T.oneOfType([T.string, T.number]).isRequired,
    children: T.array
  }).isRequired,
  primaryAction: T.func,
  actions: T.func,

  onSelect: T.func,

  /*onDrop: T.func,
   connectDragSource: T.func.isRequired,
   connectDropTarget: T.func.isRequired,*/

  card: T.func.isRequired
}

TreeDataItem.defaultProps = {
  expanded: false,
  selected: []
}

class TreeData extends Component {
  constructor(props) {
    super(props)

    // adds missing default in the definition
    this.definition = createListDefinition(this.props.definition)

    this.state = {
      expanded: false
    }
  }

  toggleAll() {

  }

  render() {
    let filtersTool
    if (this.props.filters) {
      filtersTool = Object.assign({}, this.props.filters, {
        available: getFilterableProps(this.definition)
      })
    }

    return (
      <div className="data-list">
        <ListHeader
          disabled={0 === this.props.totalResults}
          filters={filtersTool}
        />

        {0 < this.props.totalResults &&
        <div className="data-tree">
          <div className="data-tree-header">
            <button
              type="button"
              className="btn btn-tree-toggle"
              onClick={() => true}
            >
                <span className={classes('fa fa-fw', {
                  'fa-plus': !this.state.expanded,
                  'fa-minus': this.state.expanded
                })} />
            </button>

            {this.props.selection &&
            <Checkbox
              id="data-tree-select"
              label={trans('list_select_all')}
              labelChecked={trans('list_deselect_all')}
              checked={0 < this.props.selection.current.length}
              onChange={(val) => {
                val.target.checked ? this.props.selection.toggleAll(this.props.data): this.props.selection.toggleAll([])
              }}
            />
            }
          </div>

          {this.props.selection && 0 < this.props.selection.current.length &&
          <ListBulkActions
            count={this.props.selection.current.length}
            actions={getActions(
              this.props.selection.current.map(id => this.props.data.find(row => id === row.id) || {id: id}),
              this.props.actions
            )}
          />
          }

          <ul className="data-tree-content">
            {this.props.data.map((row) =>
              <TreeDataItem
                key={`tree-item-${row.id}`}
                data={row}
                actions={this.props.actions}
                primaryAction={this.props.primaryAction}
                selected={this.props.selection ? this.props.selection.current : []}
                onSelect={
                  this.props.selection ? () => {
                      this.props.selection.toggle(row, !isRowSelected(row, this.props.selection ? this.props.selection.current : []))
                    }: undefined
                }
                card={this.props.card}

                onDrop={() => {

                }}
              />
            )}
          </ul>
        </div>
        }

        {0 === this.props.totalResults &&
        <ListEmpty hasFilters={this.props.filters && 0 < this.props.filters.current.length} />
        }
      </div>
    )
  }
}

TreeData.propTypes = {
  /**
   * The data tree to display.
   */
  data: T.arrayOf(T.shape({
    // because some features (like selection) requires to retrieves some data rows
    id: T.oneOfType([T.string, T.number]).isRequired,
    // data must be a tree representation
    children: T.array
  })).isRequired,

  /**
   * Total results available in the list (without pagination if any).
   */
  totalResults: T.number.isRequired,

  /**
   * Definition of the data properties.
   */
  definition: T.arrayOf(
    T.shape(DataListPropertyTypes.propTypes)
  ).isRequired,

  /**
   * Actions available for each data row and selected rows (if selection is enabled).
   */
  actions: T.func,

  /**
   * Data primary action (aka open/edit action for rows in most cases).
   * Providing this object will automatically display the primary action (depending on the current view mode).
   */
  primaryAction: T.func,

  /**
   * Search filters configuration.
   * Providing this object automatically display the search box component.
   */
  filters: T.shape(
    DataListSearchTypes.propTypes
  ),

  /**
   * Selection configuration.
   * Providing this object automatically display select checkboxes for each data results.
   */
  selection: T.shape(
    DataListSelectionTypes.propTypes
  ),

  reorder: T.shape({

  }),

  /**
   * A function to normalize data for card display.
   * - the data row is passed as argument
   * - the func MUST return an object respecting `DataCard.propTypes`.
   *
   * It's required to enable cards based display modes.
   */
  card: T.func.isRequired
}

export {
  TreeData
}
