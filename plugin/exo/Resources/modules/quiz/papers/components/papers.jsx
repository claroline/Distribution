import React from 'react'
import {PropTypes as T} from 'prop-types'

import {connect} from 'react-redux'
import moment from 'moment'

import quizSelect from './../../selectors'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'
import {selectors as paperSelect} from './../selectors'
import {tex, t} from '#/main/core/translation'
import {ScoreBox} from './../../../items/components/score-box.jsx'
import {utils} from './../utils'
import {actions} from './../actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {DataList} from '#/main/core/layout/list/components/data-list.jsx'
import {navigate} from './../../router'

let Papers = props =>
  <div className="papers-list">
    <DataList
      data={Object.values(props.papers)}
      totalResults={Object.values(props.papers).length}
      definition={getDataListDefinition(props)}
      filters={{
        current: props.filters,
        addFilter: props.addListFilter,
        removeFilter: props.removeListFilter
      }}
      sorting={{
        current: props.sortBy,
        updateSort: props.updateSort
      }}
      pagination={Object.assign({}, props.pagination, {
        handlePageChange: props.handlePageChange,
        handlePageSizeUpdate: props.handlePageSizeUpdate
      })}
    />
  </div>

Papers.propTypes = {
  admin: T.bool.isRequired,
  papers: T.object.isRequired,
  filters: T.array.isRequired,
  addListFilter: T.func.isRequired,
  removeListFilter: T.func.isRequired,
  sortBy: T.object.isRequired,
  updateSort: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired,
  handlePageChange: T.func.isRequired,
  pagination: T.shape({
    pageSize: T.number.isRequired,
    current: T.number.isRequired
  }).isRequired
}

function getDataListDefinition(props) {
  const data = []

  if (props.admin) {
    data.push({
      name: 'user',
      type: 'string',
      label: tex('paper_list_table_user'),
      renderer: (rowData) => rowData.user ? rowData.user.name : t('anonymous')
    })
  }
  data.push({
    name: 'number',
    type: 'number',
    label: tex('paper_list_table_paper_number')
  })
  data.push({
    name: 'startDate',
    type: 'date',
    label: tex('paper_list_table_start_date'),
    renderer: (rowData) => moment(rowData.startDate).format('DD/MM/YYYY HH:mm')
  })
  data.push({
    name: 'endDate',
    type: 'date',
    label: tex('paper_list_table_end_date'),
    renderer: (rowData) => moment(rowData.endDate).format('DD/MM/YYYY HH:mm')
  })
  data.push({
    name: 'finished',
    type: 'boolean',
    label: tex('paper_finished')
  })
  data.push({
    name: 'score',
    type: 'number',
    label: tex('paper_list_table_score'),
    renderer: (rowData) => utils.showScore(
        props.admin,
        rowData.finished,
        paperSelect.showScoreAt(rowData),
        paperSelect.showCorrectionAt(rowData),
        paperSelect.correctionDate(rowData)
      ) ?
      rowData.score || 0 === rowData.score ?
        <ScoreBox size="sm" score={rowData.score} scoreMax={paperSelect.paperScoreMax(rowData)} /> :
        '-' :
      tex('paper_score_not_available')
  })
  data.push({
    name: 'actions',
    type: 'string',
    label: t('actions'),
    renderer: (rowData) => utils.showCorrection(
        props.admin,
        rowData.finished,
        paperSelect.showCorrectionAt(rowData),
        paperSelect.correctionDate(rowData)
      ) ?
      <a href={`#papers/${rowData.id}`} className="btn btn-link">
        <span className="fa fa-fw fa-eye" />
      </a> :
      ''
  })

  return data
}

function mapStateToProps(state) {
  return {
    admin: resourceSelect.editable(state) || quizSelect.papersAdmin(state),
    papers: paperSelect.papers(state),
    filters: listSelect.filters(state),
    sortBy: listSelect.sortBy(state),
    pagination: {
      pageSize: paginationSelect.pageSize(state),
      current:  paginationSelect.current(state)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // search
    addListFilter: (property, value) => {
      dispatch(listActions.addFilter(property, value))
      //dispatch(actions.fetchFilteredPapers())
    },
    removeListFilter: (filter) => {
      dispatch(listActions.removeFilter(filter))
      //dispatch(actions.fetchFilteredPapers())
    },
    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
      //dispatch(actions.fetchFilteredPapers())
    },
    // pagination
    handlePageSizeUpdate: (pageSize) => {
      dispatch(paginationActions.updatePageSize(pageSize))
      //dispatch(actions.fetchFilteredPapers())
    },
    handlePageChange: (page) => {
      dispatch(paginationActions.changePage(page))
      //dispatch(actions.fetchFilteredPapers())
    }
  }
}

const ConnectedPapers = connect(mapStateToProps, mapDispatchToProps)(Papers)

export {ConnectedPapers as Papers}
