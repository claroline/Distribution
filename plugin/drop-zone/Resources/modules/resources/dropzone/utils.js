import uuid from 'uuid'
import moment from 'moment'

export function generateId() {
  return uuid()
}

export function generateCorrection(id, dropId, user, dropzone) {
  const currentDate = moment().format('YYYY-MM-DD\THH:mm')

  return {
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
}