import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'

import {PageHeader} from '#/main/core/layout/page/components/page.jsx'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {generateUrl} from '#/main/core/fos-js-router'

// TODO : use barrel instead
import BarChart from './../../components/chart/bar/bar-chart.jsx'
import PieChart from './../../components/chart/pie/pie-chart.jsx'
import CircularGauge from './../../components/chart/gauge/circlular-gauge.jsx'

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
  <div className="general-stats row">
    <div className="col-md-3 col-xs-6">
      <CountCard label="steps" icon="fa fa-th-list" count={props.statistics.nbSteps} />
    </div>
    <div className="col-md-3 col-xs-6">
      <CountCard label="questions" icon="fa fa-question" count={props.statistics.nbQuestions} />
    </div>
    <div className="col-md-3 col-xs-6">
      <CountCard label="users" icon="fa fa-user" count={props.statistics.nbRegisteredUsers} />
      <CountCard label="anonymous" icon="fa fa-user" count={props.statistics.nbAnonymousUsers} />
    </div>
    <div className="col-md-3 col-xs-6">
      <CountCard label="papers" icon="fa fa-file" count={props.statistics.nbPapers} />
    </div>
  </div>

GeneralStats.propTypes = {
  statistics: T.object.isRequired
}

class Docimology extends Component {
  renderNoteBlock(paperScoreDistribution) {
    const scoreDistributionValues = Object.keys(paperScoreDistribution).map(key => { return paperScoreDistribution[key] })
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-body">
              <BarChart
                data={scoreDistributionValues}
                width={540}
                height={200}
              />
            </div>
          </div>
        </div>

        <div className="note-gauges col-md-6">
          <CircularGauge label="Minimum" color="#b94a48" value={this.props.statistics.minMaxAndAvgScores.min} max={this.props.statistics.maxScore} width={180} size={25} />

          <CircularGauge label="Average" color="#c09853" value={this.props.statistics.minMaxAndAvgScores.avg} max={this.props.statistics.maxScore} width={180} size={25} />

          <CircularGauge label="Maximum" color="#468847" value={this.props.statistics.minMaxAndAvgScores.max} max={this.props.statistics.maxScore} width={180} size={25} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="page-container docimology-container">
        <PageHeader title="Docimology">
          <PageActions>
            <PageAction
              id="back-to-exercise"
              title={'Back to exercise'}
              icon="fa fa-fw fa-sign-out"
              action={generateUrl('ujm_exercise_open', {id: this.props.exercise.id})}
            >
            </PageAction>
          </PageActions>
        </PageHeader>

        <GeneralStats {...this.props} />

        <h2 className="h3">Indice de réussite</h2>

        <div className="row">
          <div className="col-md-12" style={{marginBottom: '20px'}}>
            <PieChart
              data={[
                this.props.statistics.paperSuccessDistribution.nbFullSuccess,
                this.props.statistics.paperSuccessDistribution.nbPartialSuccess,
                this.props.statistics.paperSuccessDistribution.nbMissed
              ]}
              colors={['#b94a48', '#c09853', '#468847']} width={380} />
          </div>
        </div>

        <h2 className="h3">Répartition des notes</h2>
        {this.renderNoteBlock(this.props.statistics.paperScoreDistribution)}

        <h2 className="h3">Indice de difficulté</h2>
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
