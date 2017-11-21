import {tex} from '#/main/core/translation'

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

export const NUMBERING_NONE = 'none'
export const NUMBERING_LITERAL = 'litteral'
export const NUMBERING_NUMERIC = 'numeric'

export const numberingModes = [
  {value: NUMBERING_NONE,    label: tex('none')},
  {value: NUMBERING_LITERAL, label: tex('litteral')},
  {value: NUMBERING_NUMERIC, label: tex('numeric')}
]

export const VIEW_OVERVIEW = 'overview'
export const VIEW_PLAYER = 'player'
export const VIEW_EDITOR = 'editor'
export const VIEW_PAPERS = 'papers'
export const VIEW_PAPER = 'paper'
export const VIEW_CORRECTION_QUESTIONS = 'correction_questions'
export const VIEW_CORRECTION_ANSWERS = 'correction_answers'
export const VIEW_ATTEMPT_END = 'attempt_end'
export const VIEW_STATISTICS = 'view_statistics'

export const SHUFFLE_NEVER = 'never'
export const SHUFFLE_ALWAYS = 'always'
export const SHUFFLE_ONCE = 'once'

export const shuffleModes = [
  {value: SHUFFLE_NEVER,  label: tex('never')},
  {value: SHUFFLE_ALWAYS, label: tex('at_each_attempt')},
  {value: SHUFFLE_ONCE,   label: tex('at_first_attempt')}
]

export const SHOW_CORRECTION_AT_VALIDATION = 'validation'
export const SHOW_CORRECTION_AT_LAST_ATTEMPT = 'lastAttempt'
export const SHOW_CORRECTION_AT_DATE = 'date'
export const SHOW_CORRECTION_AT_NEVER = 'never'

export const correctionModes = [
  {value: SHOW_CORRECTION_AT_VALIDATION,   label: tex('at_the_end_of_assessment')},
  {value: SHOW_CORRECTION_AT_LAST_ATTEMPT, label: tex('after_the_last_attempt')},
  {value: SHOW_CORRECTION_AT_DATE,         label: tex('from')},
  {value: SHOW_CORRECTION_AT_NEVER,        label: tex('never')}
]

export const SHOW_SCORE_AT_CORRECTION = 'correction'
export const SHOW_SCORE_AT_VALIDATION = 'validation'
export const SHOW_SCORE_AT_NEVER = 'never'

export const markModes = [
  {value: SHOW_SCORE_AT_CORRECTION, label: tex('at_the_same_time_that_the_correction')},
  {value: SHOW_SCORE_AT_VALIDATION, label: tex('at_the_end_of_assessment')},
  {value: SHOW_SCORE_AT_NEVER,      label: tex('never')}
]

export const SCORE_SUM = 'sum'
export const SCORE_FIXED = 'fixed'
export const SCORE_MANUAL = 'manual'

export const TOTAL_SCORE_ON_DEFAULT = 'default'
export const TOTAL_SCORE_ON_CUSTOM = 'custom'
export const TOTAL_SCORE_ON_DEFAULT_VALUE = 100

export const STATISTICS_ALL_PAPERS = true
export const STATISTICS_FINISHED_PAPERS_ONLY = false

export const statisticsModes = [
  {value: STATISTICS_ALL_PAPERS,           label: tex('compute_from_all_papers')},
  {value: STATISTICS_FINISHED_PAPERS_ONLY, label: tex('compute_from_finished_papers_only')}
]
