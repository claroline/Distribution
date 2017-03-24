import {
  SHOW_CORRECTION_AT_VALIDATION,
  SHOW_CORRECTION_AT_LAST_ATTEMPT,
  SHOW_CORRECTION_AT_DATE,
  SHOW_SCORE_AT_CORRECTION,
  SHOW_SCORE_AT_VALIDATION
} from './../enums'

export const utils = {
  showCorrection(isAdmin, isFinished, parameters) {
    if (isAdmin) {
      return true
    } else if (parameters.showCorrectionAt === SHOW_CORRECTION_AT_VALIDATION || parameters.showCorrectionAt === SHOW_CORRECTION_AT_LAST_ATTEMPT){
      return isFinished
    } else if (parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE){
      const today = Date.parse(new Date(Date.now()))
      const correctionDate = Date.parse(parameters.correctionDate)
      return today >= correctionDate
    } else {
      return false
    }
  },
  showScore(isAdmin, isFinished, parameters) {
    if (isAdmin) {
      return true
    } else if (parameters.showScoreAt === SHOW_SCORE_AT_CORRECTION){
      return utils.showCorrection(isAdmin, isFinished, parameters)
    } else if (parameters.showScoreAt === SHOW_SCORE_AT_VALIDATION){
      return isFinished
    } else {
      return false
    }
  }
}
