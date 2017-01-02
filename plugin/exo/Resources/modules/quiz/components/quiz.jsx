import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'

import PageHeader from './../../components/layout/page-header.jsx'
import {TopBar} from './top-bar.jsx'
import {Overview} from './../overview/overview.jsx'
import Player from './../player/components/player.jsx'
import {Editor} from './../editor/components/editor.jsx'
import {Papers} from './../papers/components/papers.jsx'
import {Paper} from './../papers/components/paper.jsx'
import select from './../selectors'
import {actions as editorActions} from './../editor/actions'
import {actions as playerActions} from './../player/actions'
import {actions} from './../actions'
import {
  VIEW_OVERVIEW,
  VIEW_PLAYER,
  VIEW_EDITOR,
  VIEW_PAPERS,
  VIEW_PAPER
} from './../enums'

let Quiz = props =>
  <div>
    <PageHeader title={props.quiz.title} />
    {props.editable &&
      <TopBar
        {...props}
        id={props.quiz.id}
        testQuiz={() => props.testQuiz(props.quiz, props.steps)}
      />
    }
    {viewComponent(props.viewMode)}
  </div>

Quiz.propTypes = {
  quiz: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  }).isRequired,
  steps: T.object.isRequired,
  editable: T.bool.isRequired,
  viewMode: T.string.isRequired,
  updateViewMode: T.func.isRequired,
  testQuiz: T.func.isRequired,
  saveQuiz: T.func.isRequired
}

function viewComponent(view) {
  switch (view) {
    case VIEW_EDITOR:
      return <Editor/>
    case VIEW_PLAYER:
      return <Player/>
    case VIEW_PAPERS:
      return <Papers/>
    case VIEW_PAPER:
      return <Paper/>
    case VIEW_OVERVIEW:
    default:
      return <Overview/>
  }
}

function mapStateToProps(state) {
  return {
    quiz: select.quiz(state),
    steps: select.steps(state),
    viewMode: select.viewMode(state),
    editable: select.editable(state),
    empty: select.empty(state),
    published: select.published(state),
    hasPapers: select.hasPapers(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateViewMode(mode) {
      dispatch(actions.updateViewMode(mode))
    },
    testQuiz(quiz, steps) {
      dispatch(playerActions.play(quiz, steps, null, true))
    },
    saveQuiz() {
      dispatch(editorActions.saveQuiz())
    }
  }
}

Quiz = connect(mapStateToProps, mapDispatchToProps)(Quiz)

export {Quiz}
