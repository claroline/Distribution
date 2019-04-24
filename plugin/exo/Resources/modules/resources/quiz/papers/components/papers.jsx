import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {getTimeDiff} from '#/main/app/intl/date'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {ScoreBox} from '#/main/core/layout/evaluation/components/score-box'

import {selectors as quizSelectors} from '#/plugin/exo/resources/quiz/store/selectors'
import {selectors as paperSelectors} from '#/plugin/exo/resources/quiz/papers/store/selectors'
import {PaperCard} from '#/plugin/exo/resources/quiz/papers/components/card'

const Papers = props =>
  <Fragment>
    <h3 className="h2">
      {trans('results', {}, 'quiz')}
    </h3>

    <ListData
      name={paperSelectors.LIST_NAME}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        label: trans('open'),
        target: `/papers/${row.id}`
      })}
      fetch={{
        url: ['exercise_paper_list', {exerciseId: props.quizId}],
        autoload: true
      }}
      definition={[
        {
          name: 'number',
          label: '#',
          displayed: true,
          type: 'number'
        }, {
          name: 'user',
          label: trans('user'),
          displayed: true,
          type: 'user'
        }, {
          name: 'startDate',
          alias: 'start',
          label: trans('start_date'),
          displayed: true,
          filterable: false,
          type: 'date',
          options: {
            time: true
          }
        }, {
          name: 'endDate',
          alias: 'end',
          label: trans('end_date'),
          displayed: true,
          filterable: false,
          type: 'date',
          options: {
            time: true
          }
        }, {
          name: 'duration',
          label: trans('duration'),
          type: 'time',
          displayed: true,
          filterable: false,
          sortable: false,
          calculated: (rowData) => {
            if (rowData.startDate && rowData.endDate) {
              return getTimeDiff(rowData.startDate, rowData.endDate)
            }

            return undefined
          }
        }, {
          name: 'finished',
          label: trans('finished'),
          displayed: true,
          type: 'boolean'
        }, {
          name: 'score',
          label: trans('score'),
          displayed: props.hasScore,
          displayable: props.hasScore,
          filterable: false,
          sortable: true,
          render: (rowData) => {
            if ((rowData.score || 0 === rowData.score) && rowData.total) {
              return <ScoreBox size="sm" score={rowData.score} scoreMax={rowData.total} />
            }

            return '-'
          }
        }
      ]}

      card={PaperCard}
    />
  </Fragment>

Papers.propTypes = {
  quizId: T.string.isRequired,
  hasScore: T.bool.isRequired
}

const ConnectedPapers = connect(
  (state) => ({
    quizId: quizSelectors.id(state),
    hasScore: true // TODO
  })
)(Papers)

export {
  ConnectedPapers as Papers
}
