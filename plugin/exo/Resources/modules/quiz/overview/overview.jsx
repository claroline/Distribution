import React, {Component, PropTypes as T} from 'react'
import {connect} from 'react-redux'
import classes from 'classnames'
import {tex} from './../../utils/translate'
import select from './../selectors'
import {
  correctionModes,
  markModes,
  quizTypes,
  SHOW_CORRECTION_AT_DATE
} from './../enums'

const Parameter = props =>
  <tr>
    <th className="text-right col-md-4" scope="row">
      {tex(props.name)}
    </th>
    <td className="text-center col-md-8">
      {props.children}
    </td>
  </tr>

Parameter.propTypes = {
  name: T.string.isRequired,
  children: T.any.isRequired
}

const Parameters = props =>
  <div className="panel panel-default">
    <table className="table table-striped table-bordered">
      <tbody>
        {props.parameters.duration > 0 &&
          <Parameter name="duration">{props.parameters.duration}</Parameter>
        }
        <Parameter name="availability_of_correction">
          {props.parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE ?
            props.parameters.correctionDate :
            tex(correctionModes.find(mode => mode[0] === props.parameters.showCorrectionAt)[1])
          }
        </Parameter>
        <Parameter name="availability_of_score">
          {tex(markModes.find(mode => mode[0] === props.parameters.showScoreAt)[1])}
        </Parameter>
      </tbody>
        {props.editable && props.additionalInfo &&
          <tbody>
            <Parameter name="type">
              {tex(quizTypes.find(type => type[0] === props.parameters.type)[1])}
            </Parameter>
            <Parameter name="creation_date">{props.meta.created}</Parameter>
            <Parameter name="number_steps_draw">
              {props.parameters.pick || tex('all_step')}
            </Parameter>
            <Parameter name="random_steps">
              {tex(props.parameters.randomOrder ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="keep_same_step">
              {tex(props.parameters.randomPick ? 'no' : 'yes')}
            </Parameter>
            <Parameter name="anonymous">
              {tex(props.parameters.anonymous ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="test_exit">
              {tex(props.parameters.interruptible ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="maximum_tries">
              {props.parameters.maxAttempts || '-'}
            </Parameter>
          </tbody>
        }
    </table>
    {props.editable &&
      <div
        className="panel-footer text-center toggle-exercise-info"
        role="button"
        onClick={props.onAdditionalToggle}
      >
        <span className={classes('fa', 'fa-fw', props.additionalInfo ? 'fa-caret-up' : 'fa-caret-right')}/>
        {tex(props.additionalInfo ? 'hide_additional_info' : 'show_additional_info')}
      </div>
    }
  </div>

Parameters.propTypes = {
  editable: T.bool.isRequired,
  additionalInfo: T.bool.isRequired,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    type: T.string.isRequired,
    randomOrder: T.string.isRequired,
    randomPick: T.string.isRequired,
    pick: T.number.isRequired,
    duration: T.number.isRequired,
    maxAttempts: T.number.isRequired,
    interruptible: T.bool.isRequired,
    showCorrectionAt: T.string.isRequired,
    correctionDate: T.string,
    anonymous: T.bool.isRequired,
    showScoreAt: T.string.isRequired
  }).isRequired,
  meta: T.shape({
    created: T.string.isRequired
  })
}

const Layout = props =>
  <div className="quiz-overview">
    <div className="panel-body">
      {props.empty &&
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="alert alert-info text-center">
              <span className="fa fa-fw fa-warning"></span>
              <span>
                {tex(props.editable ?
                  'exo_empty_user_can_edit' :
                  'exo_empty_user_read_only'
                )}
              </span>
            </div>
          </div>
        </div>
      }
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          {props.description &&
            <div className="exercise-description panel panel-default">
              <div
                className="panel-body"
                dangerouslySetInnerHTML={{ __html: props.description }}
              />
            </div>
          }
          {props.parameters.showMetadata &&
            <Parameters {...props}/>
          }
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 col-md-offset-2 text-center">
          {props.empty && props.editable &&
            <a href="#/steps" role="button" className="btn btn-block btn-primary btn-lg">
              <span className="fa fa-pencil"></span>
              {tex('edit')}
            </a>
          }
          {!props.empty &&
            <button-start data-paper-link="true"/>
          }
        </div>
      </div>
    </div>
  </div>

Layout.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  description: T.string.isRequired,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    showMetadata: T.bool.isRequired
  }).isRequired,
  meta: T.shape({
    created: T.string.isRequired
  })
}

class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      additionalInfo: false
    }
  }

  render() {
    return (
      <Layout
        {...this.props}
        additionalInfo={this.state.additionalInfo}
        onAdditionalToggle={() => this.setState({
          additionalInfo: !this.state.additionalInfo}
        )}
      />
    )
  }
}

Overview.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  description: T.string.isRequired,
  parameters: T.shape({
    showMetadata: T.bool.isRequired,
    type: T.string.isRequired,
    randomOrder: T.string.isRequired,
    randomPick: T.string.isRequired,
    pick: T.number.isRequired,
    duration: T.number.isRequired,
    maxAttempts: T.number.isRequired,
    interruptible: T.bool.isRequired,
    showCorrectionAt: T.string.isRequired,
    correctionDate: T.string,
    anonymous: T.bool.isRequired,
    showScoreAt: T.string.isRequired
  }).isRequired,
  meta: T.shape({
    created: T.string.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    empty: select.empty(state),
    editable: select.editable(state),
    meta: select.meta(state),
    description: select.description(state),
    parameters: select.parameters(state)
  }
}

const ConnectedOverview = connect(mapStateToProps)(Overview)

export {ConnectedOverview as Overview}
