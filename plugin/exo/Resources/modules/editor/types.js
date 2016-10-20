import choice from './items/choice'
import match from './items/match'
import cloze from './items/cloze'
import graphic from './items/graphic'
import open from './items/open'

export const TYPE_QUIZ = 'quiz'
export const TYPE_STEP = 'step'

export const QUIZ_SUMMATIVE = 'summative'
export const QUIZ_EVALUATIVE = 'evaluative'
export const QUIZ_FORMATIVE = 'formative'

export const quizTypes = [
  [QUIZ_SUMMATIVE, 'summative'],
  [QUIZ_EVALUATIVE, 'evaluative'],
  [QUIZ_FORMATIVE, 'formative']
]

export const SHUFFLE_NEVER = 'never'
export const SHUFFLE_ONCE = 'once'
export const SHUFFLE_ALWAYS = 'always'

export const shuffleModes = [
  [SHUFFLE_NEVER, 'never'],
  [SHUFFLE_ONCE, 'at_first_attempt'],
  [SHUFFLE_ALWAYS, 'at_each_attempt']
]

export const SHOW_CORRECTION_AT_VALIDATION = 'validation'
export const SHOW_CORRECTION_AT_LAST_ATTEMPT = 'lastAttempt'
export const SHOW_CORRECTION_AT_DATE = 'date'
export const SHOW_CORRECTION_AT_NEVER = 'never'

export const correctionModes = [
  [SHOW_CORRECTION_AT_VALIDATION, 'at_the_end_of_assessment'],
  [SHOW_CORRECTION_AT_LAST_ATTEMPT, 'after_the_last_attempt'],
  [SHOW_CORRECTION_AT_DATE, 'from'],
  [SHOW_CORRECTION_AT_NEVER, 'never']
]

export const SHOW_SCORE_AT_CORRECTION = 'correction'
export const SHOW_SCORE_AT_VALIDATION = 'validation'
export const SHOW_SCORE_AT_NEVER = 'never'

export const markModes = [
  [SHOW_SCORE_AT_CORRECTION, 'at_the_same_time_that_the_correction'],
  [SHOW_SCORE_AT_VALIDATION, 'at_the_end_of_assessment'],
  [SHOW_SCORE_AT_NEVER, 'never']
]

export const UPDATE_ADD = 'add'
export const UPDATE_CHANGE = 'change'
export const UPDATE_REMOVE = 'remove'

let definitions = [
  choice,
  match,
  open,
  cloze,
  graphic
]

export const mimeTypes = definitions.map(def => def.type)

export const properties = definitions.reduce((props, def) => {
  props[def.type] = {
    name: def.name,
    question: def.question,
    component: def.component,
    reducer: def.reducer,
    initialFormValues: def.initialFormValues || (values => values),
    validateFormValues: def.validateFormValues || (() => {})
  }
  return props
}, {})
