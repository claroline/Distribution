import React, { Component } from 'react'
import { connect } from 'react-redux'

import {PageHeader} from '#/main/core/layout/page/components/page.jsx'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {generateUrl} from '#/main/core/fos-js-router'

import {t, tex} from '#/main/core/translation'

// TODO : use barrel instead
import BarChart from './../../components/chart/bar/bar-chart.jsx'
import PieChart from './../../components/chart/pie/pie-chart.jsx'
import CircularGauge from './../../components/chart/gauge/circlular-gauge.jsx'

const T = React.PropTypes

const CountCard = props =>
  <div className="count-card panel panel-default">
    <span className={`icon ${props.icon}`}></span>
    <div className="panel-body text-right">
      {props.label}
      <div className="h3 text-right text-info">{props.count}</div>
    </div>
  </div>

CountCard.propTypes = {
  icon: T.string.isRequired,
  label: T.string.isRequired,
  count: T.number.isRequired
}

const GeneralStats = props =>
  <div className="general-stats">
    <CountCard label={tex('steps')} icon="fa fa-th-list" count={props.statistics.nbSteps} />
    <CountCard label={tex('questions')} icon="fa fa-question" count={props.statistics.nbQuestions} />
    <CountCard label={t('users')} icon="fa fa-user" count={props.statistics.nbRegisteredUsers} />
    <CountCard label={t('anonymous')} icon="fa fa-user" count={props.statistics.nbAnonymousUsers} />
    <CountCard label={tex('papers')} icon="fa fa-file" count={props.statistics.nbPapers} />
  </div>

GeneralStats.propTypes = {
  statistics: T.object.isRequired
}

class Docimology extends Component {

  renderNoteBlock() {

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-body">
              <BarChart
                data={this.props.statistics.paperScoreDistribution}
                width={540}
                height={250}
                margin={{top: 20, right: 20, bottom: 80, left: 80}}
                labels={{show:true, labelX:tex('docimology_score'), labelY:tex('docimology_nb_papers')}}
              />
            </div>
          </div>
        </div>
        <div className="note-gauges col-md-6">
          <CircularGauge
            label={tex('minimum')}
            color="#b94a48"
            value={this.props.statistics.minMaxAndAvgScores.min}
            max={this.props.statistics.maxScore}
            width={180}
            size={25}
            showValue={false}
            />
          <CircularGauge
            label={tex('average')}
            color="#c09853"
            value={this.props.statistics.minMaxAndAvgScores.avg}
            max={this.props.statistics.maxScore}
            width={180}
            size={25}
            showValue={false}
            />
          <CircularGauge
            label={tex('maximum')}
            color="#468847"
            value={this.props.statistics.minMaxAndAvgScores.max}
            max={this.props.statistics.maxScore}
            width={180}
            size={25}
            showValue={false}
            />
        </div>

      </div>
    )
  }

  render() {
    return (
      <div className="page-container docimology-container">
        {/* STATISTICS HEADER */}
        <PageHeader title={tex('docimology')}>
          <PageActions>
            <PageAction
              id="back-to-exercise"
              title={tex('back_to_the_quiz')}
              icon="fa fa-fw fa-sign-out"
              action={generateUrl('ujm_exercise_open', {id: this.props.exercise.id})}
            >
            </PageAction>
          </PageActions>
        </PageHeader>

        {/* PAPER GENERAL STATISTICS */}
        <GeneralStats {...this.props} />

        {/* PAPER SUCCESS DISTRIBUTION */}
        <div className="paper-success-distribution">
          <h2 className="h3">{tex('docimology_success_index')}</h2>
          <div className="row">
            <div className="col-md-4" style={{marginBottom: '20px'}}>
              <PieChart
                data={[
                  this.props.statistics.paperSuccessDistribution.nbFullSuccess,
                  this.props.statistics.paperSuccessDistribution.nbPartialSuccess,
                  this.props.statistics.paperSuccessDistribution.nbMissed
                ]}
                colors={['#468847', '#c09853', '#b94a48']}
                width={280}
                showValue={true}
              />
            </div>
            <div className="col-md-8 legend" style={{marginBottom: '20px'}}>
              <ul>
                <li className="inline-flex">
                  <div className="color-legend" style={{backgroundColor:'#468847'}}></div>
                  <span className="legend-label">{tex('docimology_papers_totally_successfull')} {`(${this.props.statistics.paperSuccessDistribution.nbFullSuccess})`}</span>
                </li>
                <li className="inline-flex">
                  <div className="color-legend" style={{backgroundColor:'#c09853'}}></div>
                  <span className="legend-label">{tex('docimology_papers_partially_successfull')} {`(${this.props.statistics.paperSuccessDistribution.nbPartialSuccess})`}</span>
                </li>
                <li className="inline-flex">
                  <div className="color-legend" style={{backgroundColor:'#b94a48'}}></div>
                  <span className="legend-label">{tex('docimology_papers_missed')} {`(${this.props.statistics.paperSuccessDistribution.nbMissed})`}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* PAPER SCORE DISTRIBUTION */}
        <div className="paper-score-distribution">
          <h2 className="h3">{tex('docimology_score_distribution')}</h2>
          <h3 className="h5">
            <span id="help" className="help-block">
              <span className="fa fa-fw fa-info-circle"></span>
              {tex('docimology_note_gauges_help')}
            </span>
          </h3>
          {this.renderNoteBlock()}
        </div>
        {/* DIFFICULTY INDEX */}
        <div className="difficulty-index">
        <h2 className="h3">{tex('docimology_difficulty_index')}</h2>
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <BarChart
                  data={this.props.statistics.questionsDifficultyIndex}
                  width={720}
                  height={350}
                  margin={{top: 20, right: 20, bottom: 80, left: 80}}
                  labels={{show:true, labelX:tex('docimology_question_title'), labelY:tex('docimology_success_percentage')}}
                  yTicks={5}
                />
                <span id="help" className="help-block">
                  <span className="fa fa-fw fa-info-circle"></span>
                  L'indice de difficulté équivaut à un pourcentage de réussite à la question.
                </span>
                <p>
                  <span className="help-block">
                    <span className="fa fa-fw"></span>
                    Il se calcule avec le nombre de candidats ayant répondu correctement divisé par le nombre total de répondants.
                  </span>
                </p>
                <p>
                  <span className="help-block">
                    <span className="fa fa-fw"></span>
                    Si l'indice est élevé, c'est que la question est facile. Inversement, si un indice est faible, la question est difficile.
                  </span>
                </p>
                <p>
                  <span className="help-block">
                    <span className="fa fa-fw"></span>
                    Cet indice ne prend pas en compte les étudiants n'ayant pas vu la question..
                  </span>
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

Docimology.propTypes = {
  exercise: T.object.isRequired,
  statistics: T.object.isRequired
}

function mapStateToProps(state) {
  return {
    exercise: state.exercise,
    statistics: state.statistics
  }
}

export default connect(mapStateToProps, null)(Docimology)
