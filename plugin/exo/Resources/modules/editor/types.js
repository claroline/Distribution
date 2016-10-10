import choice from './items/choice'
import match from './items/match'
import short from './items/short'
import cloze from './items/cloze'
import graphic from './items/graphic'
import open from './items/open'

export const TYPE_QUIZ = 'quiz'
export const TYPE_STEP = 'step'

export const QUIZ_SUMMATIVE = '1'
export const QUIZ_EVALUATIVE = '2'
export const QUIZ_FORMATIVE = '3'

export const quizTypes = [
  [QUIZ_SUMMATIVE, 'summative'],
  [QUIZ_EVALUATIVE, 'evaluative'],
  [QUIZ_FORMATIVE, 'formative']
]

export const SHOW_CORRECTION_AT_VALIDATION = '1'
export const SHOW_CORRECTION_AT_LAST_ATTEMPT = '2'
export const SHOW_CORRECTION_AT_DATE = '3'
export const SHOW_CORRECTION_AT_NEVER = '4'

export const correctionModes = [
  [SHOW_CORRECTION_AT_VALIDATION, 'at_the_end_of_assessment'],
  [SHOW_CORRECTION_AT_LAST_ATTEMPT, 'after_the_last_attempt'],
  [SHOW_CORRECTION_AT_DATE, 'from'],
  [SHOW_CORRECTION_AT_NEVER, 'never']
]

export const SHOW_SCORE_AT_CORRECTION = '1'
export const SHOW_SCORE_AT_VALIDATION = '2'
export const SHOW_SCORE_AT_NEVER = '3'

export const markModes = [
  [SHOW_SCORE_AT_CORRECTION, 'at_the_same_time_that_the_correction'],
  [SHOW_SCORE_AT_VALIDATION, 'at_the_end_of_assessment'],
  [SHOW_SCORE_AT_NEVER, 'never']
]

let definitions = [
  choice,
  match,
  short,
  cloze,
  graphic,
  open
]

export const mimeTypes = definitions.map(def => def.type)

export const properties = definitions.reduce((props, def) => {
  props[def.type] = {
    name: def.name,
    question: def.question,
    component: def.component,
    reducer: def.reducer,
    initialFormValues: def.initialFormValues,
    validateFormValues: def.validateFormValues
  }
  return props
}, {})
