import React, { Component, PropTypes as T } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

import {trans} from './../../utils/translate'
import {getDefinition} from './../../items/item-types'
import {Icon as ItemIcon} from './../../items/components/icon.jsx'

import {
  Table,
  TableRow,
  TableCell,
  TableTooltipCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
} from './../../components/table/table.jsx'

export default class QuestionList extends Component {
  render() {
    return(
      <Table
        isEmpty={0 === this.props.questions.length}
      >
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
            <TableTooltipCell
              align="center"
              id={question.id}
              tooltip={trans(getDefinition(question.type).name, {}, 'question_types')}
            >
              <ItemIcon name={getDefinition(question.type).name} />
            </TableTooltipCell>
            <TableCell>
              <a href="">
                {question.title || question.content}
              </a>
            </TableCell>
            <TableCell>
              {question.meta.category && question.meta.category.name ? question.meta.category.name : '-'}
            </TableCell>
            <TableCell align="right">
              <small className="text-muted">{question.meta.updated}</small>
            </TableCell>
            <TableCell>
              <small className="text-muted">Axel Penin</small>
            </TableCell>
            <TableCell align="right">
              <a role="button" href="" className="btn btn-link btn-sm">
                <span className="fa fa-fw fa-pencil" />&nbsp;
                Edit
              </a>

              <DropdownButton
                id={`dropdown-other-actions-${question.id}`}
                title={<span className="fa fa-fw fa-ellipsis-v"></span>}
                bsStyle="link"
                noCaret={true}
                pullRight={true}
                className="btn-sm"
              >
                <MenuItem header>More actions</MenuItem>

                <MenuItem>
                  <span className="fa fa-fw fa-copy" />&nbsp;
                  Duplicate
                </MenuItem>
                <MenuItem>
                  <span className="fa fa-fw fa-share" />&nbsp;
                  Share
                </MenuItem>
                <MenuItem>
                  <span className="fa fa-fw fa-upload" />&nbsp;
                  Export
                </MenuItem>
                <MenuItem divider />
                <MenuItem className="btn-link-danger">
                  <span className="fa fa-fw fa-trash-o" />&nbsp;
                  Delete
                </MenuItem>
              </DropdownButton>
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
