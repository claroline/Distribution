import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DragDropContext} from 'react-dnd'
import {default as TouchBackend} from 'react-dnd-touch-backend'

import {tex} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {Router} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {select as resourceSelect} from '#/main/core/layout/resource/selectors'
import {select} from './../selectors'
import {select as editorSelect} from './../editor/selectors'

import {actions as editorActions} from './../editor/actions'
import {actions as playerActions} from './../player/actions'

import {VIEW_EDITOR} from './../enums'

import {Overview} from './../overview/components/overview.jsx'
import {Editor}   from './../editor/components/editor.jsx'
import {Player}   from './../player/components/player.jsx'

const Resource = props =>
  <ResourceContainer
    editor={{
      opened: VIEW_EDITOR === props.viewMode,
      open: '#/edit/parameters',
      save: {
        disabled: !props.saveEnabled,
        action: props.save
      }
    }}

    customActions={[
      {
        icon: 'fa fa-fw fa-home',
        label: tex('pass_quiz'),
        action: '/'
      }, {
        icon: 'fa fa-fw fa-play',
        label: tex('exercise_try'),
        displayed: props.editable,
        disabled: !props.valid,
        action: '/test'
      }, {
        icon: 'fa fa-fw fa-list',
        label: tex('results_list'),
        displayed: props.registeredUser,
        disabled: !props.hasPapers,
        action: '#papers'
      }, {
        icon: 'fa fa-fw fa-check-square-o',
        label: tex('manual_correction'),
        displayed: props.papersAdmin,
        disabled: !props.hasPapers,
        action: '#correction/questions'
      }, {
        icon: 'fa fa-fw fa-table',
        label: tex('export_csv_results'),
        displayed: props.papersAdmin,
        disabled: !props.hasPapers,
        action: generateUrl('exercise_papers_export', {exerciseId: props.quiz.id})
      }, {
        icon: 'fa fa-fw fa-bar-chart',
        label: tex('statistics'),
        displayed: props.papersAdmin,
        action: '#/statistics'
      }, {
        icon: 'fa fa-fw fa-pie-chart',
        label: tex('docimology'),
        displayed: props.docimologyAdmin,
        action: generateUrl('ujm_exercise_docimology', {id: props.quiz.id})
      }
    ]}
  >
    <Router
      routes={[
        {
          path: '/',
          component: Overview,
          exact: true
        }, {
          path: '/test',
          component: Player,
          onEnter: () => props.play(true)
        }, {
          path: '/play',
          component: Player,
          onEnter: () => props.play()
        }, {
          path: '/edit',
          canEnter: () => props.editable,
          component: Editor
        }
      ]}
    />
  </ResourceContainer>

Resource.propTypes = {
  quiz: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  }).isRequired,
  editable: T.bool.isRequired,
  valid: T.bool.isRequired,
  hasPapers: T.bool.isRequired,
  papersAdmin: T.bool.isRequired,
  docimologyAdmin: T.bool.isRequired,
  registeredUser: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,

  save: T.func.isRequired,
  play: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    quiz: select.quiz(state),
    editable: resourceSelect.editable(state),
    valid: editorSelect.valid(state),
    hasPapers: select.hasPapers(state),
    papersAdmin: select.papersAdmin(state),
    docimologyAdmin: select.docimologyAdmin(state),
    registeredUser: select.registered(state),
    saveEnabled: select.saveEnabled(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    save: () => dispatch(editorActions.save()),
    play: (testMode = false) => dispatch(playerActions.play(null, testMode)),
    edit: () => dispatch()
  }
}

const ConnectedQuiz = connect(mapStateToProps, mapDispatchToProps)(Resource)

// initialize drag'n'drop
// todo maybe initialize it lower in the components tree (there is lots of app parts that don't need dnd)
const QuizResource = DragDropContext(TouchBackend({ enableMouseEvents: true }))(ConnectedQuiz)

export {
  QuizResource
}
