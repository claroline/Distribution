import React, {PropTypes as T} from 'react'
import classes from 'classnames'

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

const TableCell = props =>
  <td className={`text-${props.align}`}>
    {props.children}
  </td>

TableCell.propTypes = {
  align: T.oneOf(['left', 'center', 'right']),
  children: T.node
}

TableCell.defaultProps = {
  align: 'left',
  children: null
}

const TableTooltipCell = props =>
  <TableCell {...props}>
    <OverlayTrigger
      placement={props.placement}
      overlay={<Tooltip id={props.id}>{props.tooltip}</Tooltip>}
    >
      <span>
        {props.children}
      </span>
    </OverlayTrigger>
  </TableCell>

TableTooltipCell.propTypes = {
  id: T.node.isRequired,
  placement: T.string,
  tooltip: T.string.isRequired,
  children: T.node
}

TableTooltipCell.defaultProps = {
  children: null
}

const TableHeaderCell = props =>
  <th scope="col" className={`text-${props.align}`}>
    {props.children}
  </th>

TableHeaderCell.propTypes = {
  align: T.oneOf(['left', 'center', 'right']),
  children: T.node
}

TableHeaderCell.defaultProps = {
  align: 'left',
  children: null
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
  onSort: T.func.isRequired,
  children: T.node
}

TableSortingCell.defaultProps = {
  align: 'left',
  direction: 0,
  children: null
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
        <a role="button" href="" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-copy" />
        </a>
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

TableHeader.propTypes = {
  children: T.array.isRequired
}

const TableRow = props =>
  <tr {...props}>
    {props.children}
  </tr>

TableRow.propTypes = {
  children: T.node.isRequired
}

const Table = props =>
  <table className="table table-striped table-hover">
    {props.children}
  </table>

Table.propTypes = {
  emptyText: T.string,
  children: T.array.isRequired
}

export {
  Table,
  TableRow,
  TableCell,
  TableTooltipCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
}