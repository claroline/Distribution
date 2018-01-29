import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

// https://momentjs.com/docs/#/durations/locale/
const EvaluationStatus = props =>
  <li className={classes('evaluation-status', {
    active: props.active
  })}>
    <h3 className="evaluation-status-heading">
      <span className={props.icon} aria-hidden={true} />
      {props.title}
    </h3>

    <div className="evaluation-planning">
      {props.children}
    </div>
  </li>

EvaluationStatus.propTypes = {
  icon: T.string.isRequired,
  title: T.string.isRequired,
  active: T.bool.isRequired,
  children: T.node
}

const Parameters = props =>
  <section className="resource-parameters">
    <h3 className="h2">Déroulement de l'évaluation</h3>

    <ul className="evaluation-parameters">
      <li className="evaluation-parameter">
        <span className="fa fa-fw fa-upload icon-with-text-right" />
        Les soumissions sont faites par :
        &nbsp;
        <b>les Equipes</b>
      </li>
      <li className="evaluation-parameter">
        <span className="fa fa-fw fa-check-square-o icon-with-text-right" />
        Les évaluations sont faites par :
        &nbsp;
        <b>les Gestionnaires</b>
      </li>
    </ul>

    <ul className="evaluation-timeline">
      <EvaluationStatus
        icon="fa fa-ban"
        title="L'évaluation n'a pas commencée."
        active={constants.STATE_NOT_STARTED === props.state}
      >
        <span>
          L'évaluation commencera le : <b>08/02/2018 08:30</b>
        </span>
      </EvaluationStatus>

      <EvaluationStatus
        icon="fa fa-upload"
        title="Les utilisateurs peuvent déposer leurs travaux."
        active={[
          constants.STATE_ALLOW_DROP,
          constants.STATE_ALLOW_DROP_AND_PEER_REVIEW
        ].indexOf(props.state) > -1}
      >
        La période est définie par les gestionnaires
      </EvaluationStatus>

      {constants.REVIEW_TYPE_PEER === props.reviewType &&
        <EvaluationStatus
          icon="fa fa-check-square-o"
          title="Les utilisateurs peuvent corriger les travaux."
          active={[
            constants.STATE_PEER_REVIEW,
            constants.STATE_ALLOW_DROP_AND_PEER_REVIEW
          ].indexOf(props.state) > -1}
        >
          La période sera définie par les gestionnaires
        </EvaluationStatus>
      }

      <EvaluationStatus
        icon="fa fa-flag-checkered"
        title="L'évaluation est terminée."
        active={constants.STATE_FINISHED === props.state}
      >
        <span>
          L'évaluation se terminera le : <b>28/02/2018 18:30</b>
        </span>
      </EvaluationStatus>
    </ul>
  </section>

Parameters.propTypes = {
  state: T.oneOf(
    Object.keys(constants.PLANNING_STATES.all)
  ).isRequired,
  planningType: T.oneOf(
    Object.keys(constants.PLANNING_TYPES)
  ).isRequired,
  dropType: T.oneOf(
    Object.keys(constants.DROP_TYPES)
  ).isRequired,
  reviewType: T.oneOf(
    Object.keys(constants.REVIEW_TYPES)
  ).isRequired
}

export {
  Parameters
}
