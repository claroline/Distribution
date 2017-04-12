import React, {Component, PropTypes as T} from 'react'
import {ListHeader} from '#/main/core/layout/list/components/header.jsx'
import {Pagination} from '#/main/core/layout/list/components/pagination.jsx'
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
} from '#/plugin/exo/components/table/table.jsx'

const EmptyList = props =>
  <div className="empty-list">
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

const Header = props =>
  <TableHeader>
    <tr>
      <TableHeaderCell align="center">
        <input type="checkbox" onChange={props.toggleSelectAll} />
      </TableHeaderCell>

      {props.columns.map(column => {
        return (
          <TableSortingCell key={column}>
            {column}
          </TableSortingCell>
        )
      })}
    </tr>
  </TableHeader>

Header.propTypes = {
  columns: T.arrayOf(T.string).isRequired,
  toggleSelectAll: T.func.isRequired
}

const Row = props =>
  <TableRow className={props.isSelected ? 'selected' : null}>
    <TableCell align="center">
      <input type="checkbox" onChange={() => props.toggleSelect(props.data)} />
    </TableCell>
    {props.columns.available.map(column => {
      return (
        <TableCell key={column}>
          {props.renderers[column] ? props.renderers[column](props.data): props.data[column]}
        </TableCell>
      )})
    }
  </TableRow>

Row.propTypes = {
  columns: T.arrayOf(T.string).isRequired,
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

    this.handlePagePrevious = this.handlePagePrevious.bind(this)
    this.handlePageNext = this.handlePageNext.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageSizeUpdate = this.handlePageSizeUpdate.bind(this)
    this.setState({selected: []})
  }

  toggleSelectAll() {

  }

  toggleSelect(data) {
    let selected = this.state.selected
    selected.indexOf(data) > -1 ? selected.push(data): selected.splice(selected.indexOf(data), 1)
    this.setState({selected})
  }

  handlePagePrevious(page) {
    this.props.onChangePage(page, this.props.pagination.pageSize)
  }

  handlePageNext(page) {
    this.props.onChangePage(page, this.props.pagination.pageSize)
  }

  handlePageChange(page) {
    return this.props.onChangePage(page, this.props.pagination.pageSize)
  }

  handlePageSizeUpdate(size) {
    this.props.onChangePage(this.props.pagination.current, size)
  }

  render() {
    return (
      <div>
        <ListHeader
          format={this.props.format}
          columns={this.props.columns}
          filters={this.props.filters}
        />

      {this.props.pagination.data.length === 0 &&
          <EmptyList hasFilter={this.props.filters.active.length !== 0}/>
        }
        <Table>
          <Header
            columns={this.props.columns.available}
            toggleSelectAll={this.toggleSelectAll}
          />
          <tbody>
            {this.props.pagination.data.map(el => {
              return (
                <Row
                  columns={this.props.columns}
                  renderers={this.props.renderers}
                  data={el}
                  toggleSelect={this.toggleSelect}
                />
              )}
            )}
          </tbody>
        </Table>
        <Pagination
          current={this.props.pagination.current - 1}
          pageSize={this.props.pagination.pageSize}
          pages={Math.ceil(this.props.pagination.totalResults/this.props.pagination.pageSize)}
          handlePagePrevious={this.handlePagePrevious}
          handlePageNext={this.handlePageNext}
          handlePageChange={this.handlePageChange}
          handlePageSizeUpdate={this.handlePageSizeUpdate}
        />
      </div>
    )
  }
}


//active & onChange should maybe be removed

LazyLoadTable.propTypes = {
  format: T.oneOf(['list', 'tiles-sm', 'tiles-lg']).isRequired,
  columns: T.shape({
    available: T.arrayOf(T.string).isRequired,
    active: T.arrayOf(T.string).isRequired
  }),
  renderers: T.object,
  filters: T.shape({
    available: T.arrayOf(T.string).isRequired,
    active: T.arrayOf(T.string).isRequired,
    onChange: T.func.isRequired
  }),
  pagination: T.shape({
    totalResults: T.number.isRequired,
    pageSize: T.number.isRequired,
    current: T.number.isRequired,
    data: T.arrayOf(T.object).isRequired
  }).isRequired,
  onChangePage: T.func,
  onSearch: T.func
}

export {
  LazyLoadTable
}
