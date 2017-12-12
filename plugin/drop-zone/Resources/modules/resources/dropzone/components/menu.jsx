import React from 'react'
import classes from 'classnames'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_GENERIC_TYPE_PICKER} from '#/main/core/layout/modal'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/player/actions'
import {DropzoneType, DropType} from '#/plugin/drop-zone/resources/dropzone/prop-types'

const Menu = props =>
  <div id="dropzone-menu">
    {props.dropzone.parameters.dropType === constants.DROP_TYPE_TEAM && !props.teams &&
      <div className="alert alert-danger">
        {trans('no_team_error', {}, 'dropzone')}
      </div>
    }

    {props.errorMessage &&
      <div className="alert alert-danger">
        {props.errorMessage}
      </div>
    }

    {props.myDrop &&
    props.myDrop.finished &&
    props.dropzone.display.displayNotationMessageToLearners &&
    props.userEvaluation &&
    [constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_FAILED].indexOf(props.userEvaluation.status) > -1 &&
    (!props.isPeerReviewEnabled || props.myDrop.unlockedUser || props.nbCorrections >= props.dropzone.parameters.expectedCorrectionTotal) &&
      <div className={classes('alert', {
        'alert-success': props.userEvaluation.status === constants.EVALUATION_STATUS_PASSED,
        'alert-danger': props.userEvaluation.status === constants.EVALUATION_STATUS_FAILED
      })}>
        <HtmlText>
          {props.userEvaluation.status === constants.EVALUATION_STATUS_PASSED ?
            props.dropzone.display.successMessage :
            props.dropzone.display.failMessage
          }
        </HtmlText>
      </div>
    }

    {props.currentState === constants.STATE_NOT_STARTED &&
      <div className="alert alert-info">
        <HtmlText>
          {trans('state_not_started', {}, 'dropzone')}
        </HtmlText>
      </div>
    }

    {props.currentState === constants.STATE_FINISHED &&
      <div className="alert alert-info">
        <HtmlText>
          {trans('state_finished', {}, 'dropzone')}
        </HtmlText>
      </div>
    }

    {props.dropzone.display.instruction &&
      <div id="instruction-container">
        <hr/>
        <h2>{trans('instructions', {}, 'dropzone')}</h2>
        <HtmlText>
          {props.dropzone.display.instruction}
        </HtmlText>
        <hr/>
      </div>
    }

    {props.user &&
    !props.myDrop &&
    !props.errorMessage &&
    !(props.dropzone.parameters.dropType === constants.DROP_TYPE_TEAM && !props.teams) &&
    [constants.STATE_ALLOW_DROP, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(props.currentState) > -1 &&
      <button
        className="btn btn-primary pull-right"
        type="button"
        onClick={() => {
          switch (props.dropzone.parameters.dropType) {
            case constants.DROP_TYPE_USER :
              props.initializeMyDrop()
              break
            case constants.DROP_TYPE_TEAM :
              if (props.teams.length === 1) {
                props.initializeMyDrop(props.teams[0].id)
              } else {
                props.showModal(MODAL_GENERIC_TYPE_PICKER, {
                  title: trans('team_selection_title', {}, 'dropzone'),
                  types: props.teams.map(t => {return {
                    type: t.id,
                    name: t.name,
                    icon: 'fa fa-users'
                  }}),
                  handleSelect: (type) => {
                    props.initializeMyDrop(type.type)
                    props.fadeModal()
                  }
                })
              }
              break
          }
        }}
      >
        {trans('start_evaluation', {}, 'dropzone')}
      </button>
    }

    {props.myDrop &&
      <div className="btn-group btn-group-justified">
        <a
          href="#/my/drop"
          className="btn btn-default"
        >
          {!props.myDrop.finished && [constants.STATE_ALLOW_DROP, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(props.currentState) > -1 ?
            <span>
              <span className="fa fa-fw fa-pencil dropzone-button-icon"/>
              {trans('complete_my_copy', {}, 'dropzone')}
            </span> :
            <span>
              <span className="fa fa-fw fa-eye dropzone-button-icon"/>
              {trans('see_my_copy', {}, 'dropzone')}
            </span>
          }
        </a>

        {props.myDrop.finished && props.isPeerReviewEnabled && props.nbCorrections < props.dropzone.parameters.expectedCorrectionTotal &&
          <a
            href="#/peer/drop"
            className="btn btn-default"
          >
            <span className="fa fa-fw fa-edit dropzone-button-icon"/>
            {trans('correct_a_copy', {}, 'dropzone')}
          </a>
        }
      </div>
    }
  </div>

Menu.propTypes = {
  user: T.object,
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  myDrop: T.shape(DropType.propTypes),
  isDropEnabled: T.bool.isRequired,
  isPeerReviewEnabled: T.bool.isRequired,
  nbCorrections: T.number.isRequired,
  currentState: T.number.isRequired,
  userEvaluation: T.shape({
    status: T.string.isRequired
  }),
  errorMessage: T.string,
  teams: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired
  })),
  initializeMyDrop: T.func.isRequired,
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: select.user(state),
    dropzone: select.dropzone(state),
    myDrop: select.myDrop(state),
    isDropEnabled: select.isDropEnabled(state),
    isPeerReviewEnabled: select.isPeerReviewEnabled(state),
    nbCorrections: select.nbCorrections(state),
    currentState: select.currentState(state),
    userEvaluation: select.userEvaluation(state),
    errorMessage: select.errorMessage(state),
    teams: select.teams(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initializeMyDrop: (teamId = null) => dispatch(actions.initializeMyDrop(teamId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props)),
    fadeModal: () => dispatch(modalActions.fadeModal())
  }
}

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu)

export {ConnectedMenu as Menu}