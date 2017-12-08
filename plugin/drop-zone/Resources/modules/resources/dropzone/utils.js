import uuid from 'uuid'
import moment from 'moment'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

export function generateId() {
  return uuid()
}

export function generateCorrection(dropId, user, dropzone, teamId = null) {
  const currentDate = moment().format('YYYY-MM-DD\THH:mm')
  const correction = {
    id: uuid(),
    drop: dropId,
    user: user,
    score: null,
    comment: null,
    startDate: currentDate,
    lastEditionDate: currentDate,
    endDate: null,
    finished: false,
    valid: true,
    editable: false,
    reported: false,
    correctionDenied: false,
    teamId: teamId,
    grades: []
  }

  return generateCorrectionGrades(correction, dropzone)
}

export function generateCorrectionGrades(correction, dropzone) {
  const grades = []

  if (dropzone.parameters.criteriaEnabled) {
    dropzone.criteria.forEach(c => {
      const grade = correction.grades.find(g => g.criterion === c.id)

      if (grade) {
        grades.push(grade)
      } else {
        grades.push({
          id: uuid(),
          value: 0,
          correction: correction.id,
          criterion: c.id
        })
      }
    })
  }

  return Object.assign({}, correction, {grades: grades})
}

export function getCorrectionKey(drop, dropzone) {
  let key = null

  switch (dropzone.parameters.dropType) {
    case constants.DROP_TYPE_USER :
      key = `user_${drop.user.id}`
      break
    case constants.DROP_TYPE_TEAM :
      key = `team_${drop.teamId}`
      break
  }

  return key
}

export function getToolDocumentType(toolDocument, tools) {
  const tool = tools.find(t => t.id === toolDocument.tool)

  return tool ? tool.type : null
}