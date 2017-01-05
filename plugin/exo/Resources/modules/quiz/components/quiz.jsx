import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'

import PageHeader from './../../components/layout/page-header.jsx'
import {Alerts} from './../../alert/components/alerts.jsx'
import {Loader} from './../../api/components/loader.jsx'
import {TopBar} from './top-bar.jsx'
import {Overview} from './../overview/overview.jsx'
import {Player} from './../player/components/player.jsx'
import {Editor} from './../editor/components/editor.jsx'
import {Papers} from './../papers/components/papers.jsx'
import {Paper} from './../papers/components/paper.jsx'
import select from './../selectors'
import {actions as editorActions} from './../editor/actions'
import {actions} from './../actions'
import {
  VIEW_OVERVIEW,
  VIEW_PLAYER,
  VIEW_EDITOR,
  VIEW_PAPERS,
  VIEW_PAPER
} from './../enums'

let Quiz = props =>
  <div className="page-container">
    <PageHeader title={props.quiz.title} />

    {props.isLoading &&
      <Loader />
    }

    {0 !== props.alerts.length &&
      <Alerts alerts={props.alerts} />
    }

    {props.editable &&
      <TopBar {...props} id={props.quiz.id}/>
    }
    <div className="page-content">
      {viewComponent(props.viewMode)}
    </div>
  </div>

Quiz.propTypes = {
  isLoading: T.bool.isRequired,
  alerts: T.array.isRequired,
  quiz: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  }).isRequired,
  steps: T.object.isRequired,
  editable: T.bool.isRequired,
  viewMode: T.string.isRequired,
  updateViewMode: T.func.isRequired,
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
    isLoading: select.isLoading(state),
    alerts: select.alerts(state),
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
    saveQuiz() {
      dispatch(editorActions.saveQuiz())
    }
  }
}

Quiz = connect(mapStateToProps, mapDispatchToProps)(Quiz)

export {Quiz}
