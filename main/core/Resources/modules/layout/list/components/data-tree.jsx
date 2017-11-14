import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {t, trans, transChoice} from '#/main/core/translation'

import {
  createListDefinition,
  getBulkActions,
  getRowActions,
  getFilterableProps,
  isRowSelected
} from '#/main/core/layout/list/utils'
import {
  DataAction as DataActionTypes,
  DataListProperty as DataListPropertyTypes,
  DataListSelection as DataListSelectionTypes,
  DataListSearch as DataListSearchTypes
} from '#/main/core/layout/list/prop-types'

import {Checkbox} from '#/main/core/layout/form/components/field/checkbox.jsx'
import {DataActions, DataBulkActions} from '#/main/core/layout/list/components/data-actions.jsx'
import {ListEmpty} from '#/main/core/layout/list/components/empty.jsx'
import {ListHeader} from '#/main/core/layout/list/components/header.jsx'

// todo there are some big c/c from data-list
// todo maybe make it a list view

class DataTreeItem extends Component {
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
        <div className={classes('data-tree-item', {
          'data-tree-leaf': !this.props.data.children || 0 === this.props.data.children.length
        })}>
          {this.props.data.children && 0 < this.props.data.children.length &&
            <button
              type="button"
              className="btn btn-tree-toggle"
              onClick={() => this.toggle()}
            >
            <span className={classes('fa fa-fw', {
              'fa-plus': !this.state.expanded,
              'fa-minus': this.state.expanded
            })} />
            </button>
          }

          <div className="data-tree-item-content">
            <div className="data-tree-item-label">
              {this.props.onSelect &&
                <input
                  type="checkbox"
                  className="data-tree-item-select"
                  checked={this.props.selected}
                  onChange={this.props.onSelect}
                />
              }
              {this.props.data.name}
            </div>

            {0 < this.props.actions.length &&
              <DataActions
                id={`actions-${this.props.data.id}`}
                item={this.props.data}
                actions={this.props.actions}
              />
            }

            {this.props.connectDragSource && this.props.connectDragSource(
              <span
                className="btn data-actions-btn btn-drag"
              >
                <span className="fa fa-fw fa-arrows" />
                <span className="sr-only">{t('move')}</span>
              </span>
            )}
          </div>
        </div>










        {this.props.data.children && 0 < this.props.data.children.length &&
          <ul
            className="data-tree-children"
            style={{
              display: this.state.expanded ? 'block':'none'
            }}
          >
            {this.props.data.children.map((child, childIndex) => this.props.connectDropTarget ? this.props.connectDropTarget(
                <DataTreeItem
                  key={`tree-child-${childIndex}`}
                  data={child}
                  actions={this.props.actions}
                  selected={this.props.selected}
                  onSelect={this.props.onSelect}
                />
              ) :
              <DataTreeItem
                key={`tree-child-${childIndex}`}
                data={child}
                actions={this.props.actions}
                selected={this.props.selected}
                onSelect={this.props.onSelect}
              />)}
          </ul>
        }
      </li>
    )
  }
}

DataTreeItem.propTypes = {
  expanded: T.bool,
  selected: T.bool,
  data: T.shape({
    id: T.oneOfType([T.string, T.number]).isRequired,
    children: T.array
  }).isRequired,
  actions: T.arrayOf(
    T.shape(DataActionTypes.propTypes)
  ).isRequired,
  //toggle: T.func.isRequired,
  onSelect: T.func,
  connectDragSource: T.func,
  connectDropTarget: T.func
}

DataTreeItem.defaultProps = {
  expanded: false,
  selected: false
}

class DataTree extends Component {
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

  toggleNode(nodeId) {

  }

  render() {
    let filtersTool
    if (this.props.filters) {
      filtersTool = Object.assign({}, this.props.filters, {
        available: getFilterableProps(this.definition)
      })
    }

    // calculate actions
    let actions = this.props.actions.slice(0)
    if (this.props.deleteAction) {
      actions.push({
        icon: 'fa fa-fw fa-trash-o',
        label: t('delete'),
        dangerous: true,
        displayed: this.props.deleteAction.displayed,
        disabled: this.props.deleteAction.disabled,
        action: typeof this.props.deleteAction.action === 'function' ?
          (rows) => this.props.deleteAction.action(
            rows,
            trans(this.translations.keys.deleteConfirmTitle, {}, this.translations.domain),
            transChoice(this.translations.keys.deleteConfirmQuestion, rows.length, {count: rows.length}, this.translations.domain)
          ) :
          this.props.deleteAction.action
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
                  label={t('list_select_all')}
                  labelChecked={t('list_deselect_all')}
                  checked={0 < this.props.selection.current.length}
                  onChange={() => this.props.selection.toggleAll(this.props.data)}
                />
              }
            </div>

            {this.props.selection && 0 < this.props.selection.current.length &&
              <DataBulkActions
                count={this.props.selection.current.length}
                selectedItems={this.props.selection.current.map(id => this.props.data.find(row => id === row.id))}
                actions={getBulkActions(actions)}
              />
            }

            <ul className="data-tree-content">
              {this.props.data.map((row, rowIndex) =>
                <DataTreeItem
                  key={`tree-item-${rowIndex}`}
                  data={row}
                  actions={getRowActions(actions)}
                  selected={isRowSelected(row, this.props.selection ? this.props.selection.current : [])}
                  onSelect={this.props.selection ? () => this.props.selection.toggle(row) : null}
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

DataTree.propTypes = {
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
  actions: T.arrayOf(
    T.shape(DataActionTypes.propTypes)
  ),

  /**
   * Data delete action.
   * Providing this object will automatically append the delete action to the actions list of rows and selection.
   */
  deleteAction: T.shape({
    disabled: T.func,
    displayed: T.func,
    // if a function is provided, it receive the `rows`, `confirmTitle`, `confirmQuestion` as param
    action: T.oneOfType([T.string, T.func]).isRequired
  }),

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
   * Override default list translations.
   */
  translations: T.shape({
    domain: T.string,
    keys: T.shape({
      searchPlaceholder: T.string,
      emptyPlaceholder: T.string,
      countResults: T.string,
      deleteConfirmTitle: T.string,
      deleteConfirmQuestion: T.string
    })
  })
}

DataTree.defaultProps = {
  actions: []
}

export {
  DataTree
}
