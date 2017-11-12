import uuid from 'uuid'
import moment from 'moment'

export function generateId() {
  return uuid()
}

export function generateCorrection(id, dropId, user, dropzone) {
  const currentDate = moment().format('YYYY-MM-DD\THH:mm')
  const correction = {
    id: id,
    drop: dropId,
    user: user,
    totalGrade: null,
    comment: null,
    startDate: currentDate,
    lastOpenDate: currentDate,
    endDate: null,
    finished: false,
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
          value: null,
          correction: correction.id,
          criterion: c.id
        })
      }
    })
  }

  return Object.assign({}, correction, {grades: grades})
}