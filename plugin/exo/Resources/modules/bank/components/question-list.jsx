import React, { Component } from 'react'
// TODO : do not load from editor
import {properties} from './../../editor/types'

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
} from './table/table.jsx'

const T = React.PropTypes

export default class QuestionList extends Component {
  render() {
    return(
      <Table>
        <TableHeader>
          <TableHeaderCell align="center">
            <input type="checkbox" />
          </TableHeaderCell>
          <TableSortingCell
            direction={'type' === this.props.sortBy.property ? this.props.sortBy.direction : 0}
            onSort={() => this.props.onSort('type')}>
            Type
          </TableSortingCell>
          <TableSortingCell
            direction={'content' === this.props.sortBy.property ? this.props.sortBy.direction : 0}
            onSort={() => this.props.onSort('content')}>
            Question
          </TableSortingCell>
          <TableSortingCell
            direction={'category' === this.props.sortBy.property ? this.props.sortBy.direction : 0}
            onSort={() => this.props.onSort('category')}>
            Category
          </TableSortingCell>
          <TableSortingCell
            direction={'updated' === this.props.sortBy.property ? this.props.sortBy.direction : 0}
            onSort={() => this.props.onSort('updated')}>
            Last modified
          </TableSortingCell>
          <TableSortingCell
            direction={'author' === this.props.sortBy.property ? this.props.sortBy.direction : 0}
            onSort={() => this.props.onSort('author')}>
            Creator
          </TableSortingCell>
          <TableHeaderCell align="right">
            
          </TableHeaderCell>
        </TableHeader>

        <tbody>
        {this.props.questions.map(question => (
          <TableRow key={question.id}>
            <TableCell align="center">
              <input type="checkbox" />
            </TableCell>
            <TableCell align="center">
              <svg className="icon-small">
                <use xlinkHref={`#icon-${properties[question.type].name}`}/>
              </svg>
            </TableCell>
            <TableCell>
              <a href="">
                {question.title || question.content}
              </a>
            </TableCell>
            <TableCell>
              {question.meta.category}
            </TableCell>
            <TableCell align="right">
              <small className="text-muted">{question.meta.updated}</small>
            </TableCell>
            <TableCell>
              <small className="text-muted">Axel Penin</small>
            </TableCell>
            <TableCell align="right">
              <a role="button" href="" className="btn btn-sm btn-link">
                <span className="fa fa-fw fa-pencil" />
              </a>
              <a role="button" href="" className="btn btn-sm btn-link">
                <span className="fa fa-fw fa-share" />
              </a>
              <a role="button" href="" className="btn btn-sm btn-link">
                <span className="fa fa-fw fa-upload" />
              </a>
              <a role="button" href="" className="btn btn-sm btn-link btn-link-danger">
                <span className="fa fa-fw fa-trash-o" />
              </a>
            </TableCell>
          </TableRow>
        ))}
        </tbody>
      </Table>
    )
  }
}

QuestionList.propTypes = {
  questions: T.array.isRequired,
  sortBy: T.object.isRequired,
  onSort: T.func.isRequired
}