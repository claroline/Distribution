import {createSelector} from 'reselect'

import {trans} from '#/main/core/translation'
import {now} from '#/main/core/scaffolding/date'
import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

const dropzone = state => state.dropzone
const user = state => state.user
const teams = state => state.teams
const userEvaluation = state => state.userEvaluation
const errorMessage = state => state.errorMessage
const myDrop = state => state.myDrop

const drops = state => state.drops
const currentDrop = state => state.currentDrop
const correctorDrop = state => state.correctorDrop
const corrections = state => state.corrections
const correctionForm = state => state.correctionForm
const nbCorrections = state => state.nbCorrections
const tools = state => state.tools.data
const myDrops = state => state.myDrops
const peerDrop = state => state.peerDrop

const userHasTeam = createSelector(
  [teams],
  (teams) => teams && 0 < teams.length
)

const dropzoneRequireTeam = createSelector(
  [dropzone],
  (dropzone) => constants.DROP_TYPE_TEAM === dropzone.parameters.dropType
)

const myDropId = createSelector(
  [myDrop],
  (myDrop) => myDrop && myDrop.id ? myDrop.id : null
)

const myTeamId = createSelector(
  [myDrop],
  (myDrop) => myDrop && myDrop.teamId ? myDrop.teamId : null
)

const isDropEnabledManual = createSelector(
  [dropzone],
  (dropzone) => [
    constants.STATE_ALLOW_DROP,
    constants.STATE_ALLOW_DROP_AND_PEER_REVIEW
  ].indexOf(dropzone.planning.state) > -1
)

const isDropEnabledAuto = createSelector(
  [dropzone],
  (dropzone) => {
    return dropzone.planning.drop && now() >= dropzone.planning.drop[0] && now() <= dropzone.planning.drop[1]
  }
)

const isDropEnabled = createSelector(
  [user, dropzone, isDropEnabledManual, isDropEnabledAuto, userHasTeam, dropzoneRequireTeam],
  (user, dropzone, isDropEnabledManual, isDropEnabledAuto, userHasTeam, dropzoneRequireTeam) => {
    return !!user
      && (!dropzoneRequireTeam || userHasTeam)
      && (constants.PLANNING_TYPE_MANUAL === dropzone.planning.type ? isDropEnabledManual : isDropEnabledAuto)
  }
)

const isPeerReviewEnabled = createSelector(
  [dropzone],
  (dropzone) => {
    let planningReviewAllowed = false
    if (constants.PLANNING_TYPE_MANUAL === dropzone.planning.type) {
      // manual planing, checks state
      planningReviewAllowed = [constants.STATE_PEER_REVIEW, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(dropzone.planning.state) > -1
    } else {
      // auto planning, checks dates
      planningReviewAllowed = now() >= dropzone.planning.review[0] && now() <= dropzone.planning.review[1]
    }

    return dropzone.parameters.reviewType && planningReviewAllowed
  }
)

const currentState = createSelector(
  [dropzone],
  (dropzone) => {
    let currentState = constants.STATE_NOT_STARTED

    if (constants.PLANNING_TYPE_MANUAL === dropzone.planning.type) {
      // manual planning, just get the state defined by managers
      currentState = dropzone.planning.state
    } else {
      // auto planning, calculate state from date ranges
      const currentDate = now()

      if (currentDate >= dropzone.planning.drop[0]) {
        if (currentDate > dropzone.planning.drop[1] && currentDate > dropzone.planning.review[1]) {
          currentState = constants.STATE_FINISHED
        } else if (currentDate > dropzone.planning.drop[1] && currentDate < dropzone.planning.review[0]) {
          currentState = constants.STATE_WAITING_FOR_PEER_REVIEW
        } else {
          if (dropzone.planning.drop[0] <= currentDate && currentDate <= dropzone.planning.drop[1]) {
            currentState = constants.STATE_ALLOW_DROP
          }
          if (dropzone.planning.review[0] <= currentDate && currentDate <= dropzone.planning.review[1]) {
            currentState = constants.STATE_PEER_REVIEW
          }
        }
      }
    }

    return currentState
  }
)

// get why drop is disabled
const dropDisabledMessages = createSelector(
  [user, dropzone, currentState, dropzoneRequireTeam, userHasTeam, isDropEnabledManual],
  (user, dropzone, currentState, dropzoneRequireTeam, userHasTeam, isDropEnabledManual) => {
    const messages = []

    // anonymous user error
    if (!user) {
      messages.push(trans('user_required', {}, 'dropzone'))
    }

    // no team error
    if (dropzoneRequireTeam && !userHasTeam) {
        messages.push(trans('team_required', {}, 'dropzone'))
    }

    // state error
    switch (currentState) {
      // not started error
      case constants.STATE_NOT_STARTED:
        messages.push(trans('state_not_started', {}, 'dropzone'))
        break

      // finished error
      case constants.STATE_FINISHED:
        messages.push(trans('state_finished', {}, 'dropzone'))
        break

      // otherwise checks drop date boundaries
      default:
        if (constants.PLANNING_TYPE_MANUAL === dropzone.planning.type) {
          if (!isDropEnabledManual) {
            messages.push(trans('drop_not_active', {}, 'dropzone'))
          }
        } else {
          if (now() < dropzone.planning.drop[0]) {
            // drop has not already started
            messages.push(trans('drop_not_started', {}, 'dropzone'))
          } else if (now() > dropzone.planning.drop[1]) {
            // drop has already finished
            messages.push(trans('drop_finished', {}, 'dropzone'))
          }
        }

        break
    }

    return messages
  }
)

const reviewDisabledMessages = createSelector(
  [myDrop],
  (myDrop) => {
    // all corrections done
    [
      !myDrop.finished && trans('drop_not_finished', {}, 'dropzone')
    ]
  }
)

export const select = {
  user,
  userEvaluation,
  dropzone,
  myDrop,
  myDrops,
  myDropId,
  peerDrop,
  isDropEnabled,
  isPeerReviewEnabled,
  currentState,
  drops,
  currentDrop,
  correctorDrop,
  corrections,
  correctionForm,
  nbCorrections,
  tools,
  teams,
  myTeamId,
  errorMessage,
  dropDisabledMessages,
  reviewDisabledMessages
}
