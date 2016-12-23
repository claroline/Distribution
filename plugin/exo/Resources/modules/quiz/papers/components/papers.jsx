import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import {tex} from './../../../utils/translate'

export const PaperRow = props =>
  <tr>
    {props.admin &&
      <td>{props.user}</td>
    }
    <td>{props.number}</td>
    <td>{props.start}</td>
    <td>{props.end || '-'}</td>
    <td>{tex(props.interrupted ? 'yes' : 'no')}</td>
    <td>{props.score}</td>
    <td>
      <span className="fa fa-eye"></span>
    </td>
  </tr>

PaperRow.propTypes = {
  admin: T.bool.isRequired,
  user: T.string.isRequired,
  number: T.number.isRequired,
  start: T.string.isRequired,
  end: T.string,
  interrupted: T.bool.isRequired,
  score: T.string.isRequired
}

let Papers = props =>
  <table className="papers-list table table-striped table-hover">
    <thead>
      <tr>
        {props.admin &&
          <th>{tex('paper_list_table_user')}</th>
        }
        <th>{tex('paper_list_table_paper_number')}</th>
        <th>{tex('paper_list_table_start_date')}</th>
        <th>{tex('paper_list_table_end_date')}</th>
        <th>{tex('paper_finished')}</th>
        <th>{tex('paper_list_table_score')}</th>
        <th>{tex('actions')}</th>
      </tr>
    </thead>
    <tbody>
      {props.papers.map(paper => <PaperRow {...paper}/>)}
    </tbody>
  </table>

Papers.propTypes = {
  admin: T.bool.isRequired,
  papers: T.arrayOf(T.object).isRequired
}

function mapStateToProps() {
  return {
    admin: true,
    papers: []
  }
}

const ConnectedPapers = connect(mapStateToProps)(Papers)

export {ConnectedPapers as Papers}
