import React from 'react'
import {PropTypes as T} from 'prop-types'

import {isPropSortable} from '#/main/core/layout/list/utils'
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableSortingCell,
  TableRow,
  TableCell
} from '#/main/core/layout/table/components/table.jsx'

const DataTable = props =>
  <Table className="data-table">
    <TableHeader>
      {props.columns.map(column => isPropSortable(column) ?
        <TableSortingCell key={column.name}>
          {column.label}
        </TableSortingCell>
        :
        <TableHeaderCell key={column.name}>
          {column.label}
        </TableHeaderCell>
      )}
    </TableHeader>

    <tbody>
      {props.data.map((row, rowIndex) =>
        <TableRow key={`data-row-${rowIndex}`}>
          {props.columns.map((column, columnIndex) =>
            <TableCell key={`data-cell-${columnIndex}`}>
              {typeof column.renderer === 'function' ?
                column.renderer(row) : row[column.name]
              }
            </TableCell>
          )}
        </TableRow>
      )}
    </tbody>
  </Table>

DataTable.propTypes = {
  selectable: T.bool,
  columns: T.arrayOf(T.shape({
    name: T.string.isRequired,
    type: T.string.isRequired,
    flags: T.number,
    renderer: T.func
  })),
  data: T.arrayOf(T.object).isRequired
}

DataTable.defaultProps = {
  selectable: false
}

export {DataTable}
