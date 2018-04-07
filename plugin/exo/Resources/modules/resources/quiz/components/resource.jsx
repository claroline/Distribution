import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DragNDropContext} from '#/main/app/dnd'
import {trans} from '#/main/core/translation'
import {RoutedPageContent} from '#/main/core/layout/router/components/page'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'
import {select as resourceSelect} from '#/main/core/resource/selectors'

import {CustomDragLayer} from '#/plugin/exo/utils/custom-drag-layer'
import {TYPE_QUIZ} from '#/plugin/exo/quiz/enums'
import {select} from '#/plugin/exo/quiz/selectors'
import {actions as correctionActions} from '#/plugin/exo/quiz/correction/actions'
import {actions as editorActions} from '#/plugin/exo/quiz/editor/actions'
import {actions as papersActions} from '#/plugin/exo/quiz/papers/actions'
import {actions as playerActions} from '#/plugin/exo/quiz/player/actions'
import {actions as statisticsActions} from '#/plugin/exo/quiz/statistics/actions'

import {Overview}   from '#/plugin/exo/quiz/overview/overview'
import {Player}     from '#/plugin/exo/quiz/player/components/player'
import {AttemptEnd} from '#/plugin/exo/quiz/player/components/attempt-end'
import {Editor}     from '#/plugin/exo/quiz/editor/components/editor'
import {Papers}     from '#/plugin/exo/quiz/papers/components/papers'
import {Paper}      from '#/plugin/exo/quiz/papers/components/paper'
import {Questions}  from '#/plugin/exo/quiz/correction/components/questions'
import {Answers}    from '#/plugin/exo/quiz/correction/components/answers'
import {Statistics} from '#/plugin/exo/quiz/statistics/components/statistics'

const Resource = props =>
  <ResourcePageContainer
    editor={{
      path: '/edit',
      save: {
        disabled: !props.saveEnabled,
        action: props.save
      }
    }}
    customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        displayed: props.hasOverview,
        target: '/',
        exact: true
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-play',
        label: trans('pass_quiz', {}, 'quiz'),
        target: '/play'
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-play',
        label: trans('exercise_try', {}, 'quiz'),
        displayed: props.editable,
        target: '/test'
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-list',
        label: trans('results_list', {}, 'quiz'),
        disabled: !props.hasPapers,
        displayed: props.registeredUser,
        target: '/papers'
      }, {
        type: 'url',
        icon: 'fa fa-fw fa-table',
        label: trans('export_csv_results', {}, 'quiz'),
        disabled: !props.hasPapers,
        displayed: props.papersAdmin,
        target: ['exercise_papers_export', {exerciseId: props.quizId}]
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-check-square-o',
        label: trans('manual_correction', {}, 'quiz'),
        disabled: !props.hasPapers,
        displayed: props.papersAdmin,
        target: '/correction/questions'
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-bar-chart',
        label: trans('statistics', {}, 'quiz'),
        displayed: props.papersAdmin,
        target: '/statistics'
      }, {
        type: 'url',
        icon: 'fa fa-fw fa-pie-chart',
        label: trans('docimology', {}, 'quiz'),
        displayed: props.docimologyAdmin,
        target: ['ujm_exercise_docimology', {id: props.quizId}]
      }
    ]}
  >
    <RoutedPageContent
      key="resource-content"
      headerSpacer={true}
      routes={[
        {
          path: '/',
          exact: true,
          component: Overview,
          disabled: !props.hasOverview
        }, {
          path: '/edit',
          component: Editor,
          disabled: !props.editable,
          onEnter: () => props.edit(props.quizId)
        }, {
          path: '/test',
          component: Player,
          disabled: props.editable,
          onEnter: () => props.testMode(true)
        }, {
          path: '/play',
          component: Player,
          onEnter: () => props.testMode(false)
        }, {
          path: '/play/end', // todo : declare inside player module
          component: AttemptEnd
        }, {
          path: '/papers',
          component: Papers,
          disabled: props.registeredUser,
          onEnter: () => props.results()
        }, {
          path: '/papers/:id', // todo : declare inside papers module
          component: Paper,
          onEnter: (params = {}) => props.result(params.id)
        }, {
          path: '/correction/questions',
          component: Questions,
          disabled: props.papersAdmin,
          onEnter: () => props.correction()
        }, {
          path: '/correction/questions/:id', // todo : declare inside correction module
          component: Answers,
          disabled: props.papersAdmin,
          onEnter: (params = {}) => props.correction(params.id)
        }, {
          path: '/statistics',
          components: Statistics,
          disabled: props.papersAdmin
        }
      ]}
      redirect={[
        {
          from: '/',
          exact: true,
          to: '/play',
          disabled: props.hasOverview || props.editable
        }, {
          from: '/',
          exact: true,
          to: '/test',
          disabled: props.hasOverview || !props.editable
        }
      ]}
    />

    <CustomDragLayer
      key="drag-layer"
    />
  </ResourcePageContainer>

Resource.propTypes = {
  quizId: T.string.isRequired,
  editable: T.bool.isRequired,
  hasUserPapers: T.bool.isRequired,
  registeredUser: T.bool.isRequired,
  hasOverview: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,
  save: T.func.isRequired,
  edit: T.func.isRequired,
  testMode: T.func.isRequired,
  results: T.func.isRequired,
  result: T.func.isRequired,
  statistics: T.func.isRequired
}

const QuizResource = DragNDropContext(
  connect(
    (state) => ({
      quizId: select.id(state),
      editable: resourceSelect.editable(state),
      hasPapers: select.hasPapers(state),
      hasUserPapers: select.hasUserPapers(state),
      hasOverview: select.hasOverview(state),
      papersAdmin: select.papersAdmin(state),
      docimologyAdmin: select.docimologyAdmin(state),
      registeredUser: select.registered(state),
      saveEnabled: select.saveEnabled(state)
    }),
    (dispatch) => ({
      save: () => dispatch(editorActions.save()),
      edit: (quizId) => dispatch(editorActions.selectObject(quizId, TYPE_QUIZ)),
      testMode: (testMode) => dispatch(playerActions.setTestMode(testMode)),
      results: () => dispatch(papersActions.listPapers()),
      result: (paperId) => dispatch(papersActions.displayPaper(paperId)),
      statistics: () => dispatch(statisticsActions.displayStatistics()),
      correction: (questionId = null) => {
        if (!questionId) {
          dispatch(correctionActions.displayQuestions())
        } else {
          dispatch(correctionActions.displayQuestionAnswers(questionId))
        }
      }
    })
  )(Resource)
)

export {
  QuizResource
}
