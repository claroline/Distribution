import React, {Component, PropTypes as T} from 'react'
import cloneDeep from 'lodash/cloneDeep'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
} from '#/plugin/exo/components/table/table.jsx'
import {findIndex} from './../utilities'

const Header = props =>
  <TableHeader>
    <tr>
      <TableHeaderCell align="center">
        <input
          type="checkbox"
          onChange={props.toggleSelectAll}
          checked={props.isSelected}
        />
      </TableHeaderCell>

      {props.columns.map(column =>
        <TableSortingCell key={column} onSort={() => true}>
          {column}
        </TableSortingCell>
      )}
    </tr>
  </TableHeader>

Header.propTypes = {
  columns: T.arrayOf(T.string).isRequired,
  toggleSelectAll: T.func.isRequired,
  isSelected: T.bool
}

Header.defaultProps = {
  isSelected: false
}

const Row = props =>
  <TableRow className={props.isSelected ? 'selected' : null}>
    <TableCell align="center">
      <input
        type="checkbox"
        onChange={() => props.toggleSelect(props.data)}
        checked={props.isSelected}
      />
    </TableCell>

    {props.columns.available.map(column =>
      <TableCell key={column}>
        {props.renderers[column] ? props.renderers[column](props.data): props.data[column]}
      </TableCell>
    )}
  </TableRow>

Row.propTypes = {
  columns: T.shape({
    available: T.arrayOf(T.string).isRequired,
    active: T.arrayOf(T.string).isRequired
  }).isRequired,
  data: T.object.isRequired,
  renderers: T.object,
  toggleSelect: T.func.isRequired,
  isSelected: T.bool.isRequired
}

Row.defaultProps = {
  isSelected: false
}

class LazyLoadTable extends Component {
  constructor(props) {
    super(props)

    this.toggleSelectAll = this.toggleSelectAll.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
  }

  toggleSelectAll(event) {
    this.props.onSelect(event.target.checked ? this.props.data: [])
  }

  toggleSelect(data) {
    const selected = cloneDeep(this.props.selected)
    this.isSelected(data) ? selected.splice(findIndex(selected, data), 1): selected.push(data)
    this.props.onSelect(selected)
  }

  findIndex(el) {
    return findIndex(this.props.selected, el)
  }

  isSelected(el) {
    return this.findIndex(el) > -1
  }

  isAllSelected() {
    return this.props.selected.length === this.props.data.length
  }

  render() {
    return (
      <DataList
        definition={this.props.definition}
        totalResults={this.props.totalResults}
        display={this.props.display}
        filters={this.props.filters}
        pagination={this.props.pagination}
        selection={this.props.selection}
      >
        <Table>
          <Header
            columns={this.props.columns.available}
            toggleSelectAll={this.toggleSelectAll}
            isSelected={this.isAllSelected()}
          />
          <tbody>
          {this.props.data.map((el, i) => {
            return (
              <Row
                key={i}
                columns={this.props.columns}
                renderers={this.props.renderers}
                data={el}
                toggleSelect={this.toggleSelect}
                isSelected={this.isSelected(el)}
              />
            )}
          )}
          </tbody>
        </Table>
      </DataList>
    )
  }
}

LazyLoadTable.propTypes = {
  data: T.arrayOf(T.object),
  definition: T.arrayOf(T.object),

  totalResults: T.number.isRequired,

  selected: T.arrayOf(T.object),

  display: T.shape({
    available: T.array.isRequired,
    active: T.string.isRequired,
    onChange: T.func.isRequired
  }),

  filters: T.object.isRequired,

  pagination: T.object.isRequired,

  selection: T.object.isRequired,

  /*renderers: T.object,*/
  /*onSelect: T.func,*/
  /*onSearch: T.func*/
}

LazyLoadTable.defaultProps = {
  data: [],
  selected: []
}

export {LazyLoadTable}
