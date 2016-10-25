import React, { Component } from 'react'
import classes from 'classnames'

const T = React.PropTypes

const TableCell = props =>
  <td className={`text-${props.align}`}>
    {props.children}
  </td>

TableCell.propTypes = {
  align: T.oneOf(['left', 'center', 'right'])
}

TableCell.defaultProps = {
  align: 'left'
}

const TableHeaderCell = props =>
  <th scope="col" className={`text-${props.align}`}>
    {props.children}
  </th>

TableHeaderCell.propTypes = {
  align: T.oneOf(['left', 'center', 'right'])
}

TableHeaderCell.defaultProps = {
  align: 'left'
}

const TableSortingCell = props =>
  <th
    scope="col"
    className={`sorting-cell text-${props.align}`}
    onClick={e => {
      e.stopPropagation()
      props.onSort()
    }}
  >
    {props.children}

    <span className={
      classes(
        'fa',
        0 === props.direction ? 'fa-sort' : (1 === props.direction ? 'fa-sort-asc' : 'fa-sort-desc')
      )} aria-hidden="true"></span>
  </th>

TableSortingCell.propTypes = {
  align: T.oneOf(['left', 'center', 'right']),
  direction: T.oneOf([0, -1, 1]),
  onSort: T.func.isRequired
}

TableSortingCell.defaultProps = {
  align: 'left',
  direction: 0
}

const TableHeader = props =>
  <thead>
    <tr>
      {props.children}
    </tr>
    <tr className="selected-rows active">
      <td className="text-center">
        <span className="fa fa-check-square"></span>
      </td>
      <td colSpan={props.children.length - 2}>
        <b>10</b> questions selected (<a href="">select all <b>153</b> questions</a>)
      </td>
      <td className="text-right">
        <button role="button" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-share" />
        </button>
        <button role="button" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-upload" />
        </button>
        <button role="button" className="btn btn-sm btn-link btn-link-danger">
          <span className="fa fa-fw fa-trash-o" />
        </button>
      </td>
    </tr>
  </thead>

const TableRow = props =>
  <tr>
    {props.children}
  </tr>

const Table = props =>
  <table className="table table-striped table-hover">
    {props.children}
  </table>

Table.propTypes = {
  emptyText: T.string
}

export {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
}