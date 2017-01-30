import React, { Component, PropTypes as T } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

import {tex, trans} from './../../utils/translate'
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

const SelectedRow = props =>
    <tr className="selected-rows active">
      <td className="text-center">
        <span className="fa fa-check-square"></span>
      </td>
      <td colSpan={5}>
        <b>10</b> questions selected (<a href="">select all <b>153</b> questions</a>)
      </td>
      <td className="table-actions text-right">
        <a role="button" href="" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-copy" />
          <span className="sr-only">{tex('questions_duplicate')}</span>
        </a>
        <button role="button" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-share" />
          <span className="sr-only">{tex('questions_share')}</span>
        </button>
        <button role="button" className="btn btn-sm btn-link">
          <span className="fa fa-fw fa-upload" />
          <span className="sr-only">{tex('questions_export')}</span>
        </button>
        <button role="button" className="btn btn-sm btn-link btn-link-danger">
          <span className="fa fa-fw fa-trash-o" />
          <span className="sr-only">{tex('questions_delete')}</span>
        </button>
      </td>
    </tr>

SelectedRow.propTypes = {

}

const QuestionTableHeader = props =>
  <TableHeader>
    <tr>
      <TableHeaderCell align="center">
        <input type="checkbox" onChange={props.toggleSelectAll} />
      </TableHeaderCell>
      <TableSortingCell
        direction={'type' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('type')}
      >
        Type
      </TableSortingCell>
      <TableSortingCell
        direction={'content' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('content')}
      >
        Question
      </TableSortingCell>
      <TableSortingCell
        direction={'category' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('category')}
      >
        Category
      </TableSortingCell>
      <TableSortingCell
        direction={'updated' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('updated')}
      >
        Last modified
      </TableSortingCell>
      <TableSortingCell
        direction={'author' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('author')}
      >
        Creator
      </TableSortingCell>
      <TableHeaderCell align="right">&nbsp;</TableHeaderCell>
    </tr>
    <SelectedRow />
  </TableHeader>

QuestionTableHeader.propTypes = {
  selected: T.array.isRequired,
  sortBy: T.shape({
    property: T.string,
    direction: T.number
  }),
  toggleSelectAll: T.func.isRequired,
  onSort: T.func.isRequired
}

const QuestionRow = props =>
  <TableRow className={props.isSelected ? 'selected' : null}>
    <TableCell align="center">
      <input type="checkbox" onChange={() => props.toggleSelect(props.question)} />
    </TableCell>
    <TableTooltipCell
      align="center"
      id={props.question.id}
      tooltip={trans(getDefinition(props.question.type).name, {}, 'question_types')}
    >
      <ItemIcon name={getDefinition(props.question.type).name} />
    </TableTooltipCell>
    <TableCell>
      <a href="">
        {props.question.title || props.question.content}
      </a>
    </TableCell>
    <TableCell>
      {props.question.meta.category && props.question.meta.category.name ? props.question.meta.category.name : '-'}
    </TableCell>
    <TableCell align="right">
      <small className="text-muted">{props.question.meta.updated}</small>
    </TableCell>
    <TableCell>
      <small className="text-muted">Axel Penin</small>
    </TableCell>
    <TableCell align="right" className="table-actions">
      <a role="button" href="" className="btn btn-link btn-sm">
        <span className="fa fa-fw fa-pencil" />&nbsp;
        {tex('question_edit')}
      </a>

      <DropdownButton
        id={`dropdown-other-actions-${props.question.id}`}
        title={<span className="fa fa-fw fa-ellipsis-v"></span>}
        bsStyle="link"
        noCaret={true}
        pullRight={true}
        className="btn-sm"
      >
        <MenuItem header>More actions</MenuItem>

        <MenuItem>
          <span className="fa fa-fw fa-copy" />&nbsp;
          {tex('question_duplicate')}
        </MenuItem>
        <MenuItem>
          <span className="fa fa-fw fa-share" />&nbsp;
          {tex('question_share')}
        </MenuItem>
        <MenuItem>
          <span className="fa fa-fw fa-upload" />&nbsp;
          {tex('question_export')}
        </MenuItem>
        <MenuItem divider />

        <MenuItem
          className="link-danger"
          onClick={() => props.onDelete(props.question)}
        >
          <span className="fa fa-fw fa-trash-o" />&nbsp;
          {tex('question_delete')}
        </MenuItem>
      </DropdownButton>
    </TableCell>
  </TableRow>

QuestionRow.propTypes = {
  question: T.shape({
    title: T.string,
    content: T.string.isRequired,
    meta: T.object.isRequired
  }).isRequired,
  isSelected: T.bool,
  onDelete: T.func.isRequired
}

QuestionRow.defaultProps = {
  isSelected: false
}

export default class QuestionList extends Component {
  render() {
    return(
      <Table
        isEmpty={0 === this.props.questions.length}
      >
        <QuestionTableHeader
          selected={this.props.selected}
          toggleSelectAll={this.props.toggleSelectAll}
          sortBy={this.props.sortBy}
          onSort={this.props.onSort}
        />

        <tbody>
        {this.props.questions.map(question => (
          <QuestionRow
            key={question.id}
            question={question}
            isSelected={-1 !== this.props.selected.indexOf(question.id)}
            onDelete={this.props.onDelete}
            toggleSelect={this.props.toggleSelect}
          />
        ))}
        </tbody>
      </Table>
    )
  }
}

QuestionList.propTypes = {
  questions: T.array.isRequired,
  selected: T.array.isRequired,
  sortBy: T.object.isRequired,
  onSort: T.func.isRequired,
  onDelete: T.func.isRequired,
  toggleSelect: T.func.isRequired,
  toggleSelectAll: T.func.isRequired
}
