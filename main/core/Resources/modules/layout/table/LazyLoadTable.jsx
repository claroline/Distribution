import React, {Component, PropTypes as T} from 'react'
import {ListHeader} from '#/main/core/layout/list/components/header.jsx'
import {Pagination} from '#/main/core/layout/list/components/pagination.jsx'
import cloneDeep from 'lodash/cloneDeep'
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

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<TableHeader>
      <tr>
        <TableHeaderCell align="center">
          <input
            type="checkbox"
            onChange={this.props.toggleSelectAll}
            checked={this.props.isSelected}
          />
        </TableHeaderCell>

        {this.props.columns.map(column => {
          return (
            <TableSortingCell key={column}>
              {column}
            </TableSortingCell>
          )
        })}
      </tr>
    </TableHeader>)
  }
}

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
    this.toggleSelectAll = this.toggleSelectAll.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
  }

  componentDidMount() {
    this.setState({selected: []})
  }

  toggleSelectAll(event) {
    this.setState({selected: event.target.checked ? cloneDeep(this.props.pagination.data): []})
  }

  toggleSelect(data) {
    let selected = this.state.selected
    !this.isSelected(data) ? selected.push(data): selected.splice(this.findIndex(data), 1)
    this.setState({selected})
  }

  handlePagePrevious() {
    //-2 because current starts at 0
    this.setState({selected: []})
    this.props.onChangePage(this.props.pagination.current - 2, this.props.pagination.pageSize)
  }

  handlePageNext() {
    //no +1 because current starts at 0
    this.setState({selected: []})
    this.props.onChangePage(this.props.pagination.current, this.props.pagination.pageSize)
  }

  handlePageChange(page) {
    this.setState({selected: []})
    return this.props.onChangePage(page, this.props.pagination.pageSize)
  }

  handlePageSizeUpdate(size) {
    this.setState({selected: []})
    const page = 0
    //maybe compute a way to display the page of the current result
    this.props.onChangePage(page, size)
  }

  findIndex(el) {
    if (!this.state) return -1

    //slow but gives correct result
    return this.state.selected.findIndex(selected => JSON.stringify(selected) === JSON.stringify(el))
  }

  isSelected(el) {
    return this.findIndex(el) > -1
  }

  isAllSelected() {
    if (!this.state) return false

    //not effective at all but gets the job done
    return this.state.selected.length === this.props.pagination.data.length
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
            isSelected={this.isAllSelected()}
          />
          <tbody>
            {this.props.pagination.data.map(el => {
              return (
                <Row
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
