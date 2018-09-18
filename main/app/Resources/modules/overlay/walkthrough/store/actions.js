import {makeActionCreator} from '#/main/app/store/actions'

export const WALKTHROUGH_SKIP = 'WALKTHROUGH_SKIP'
export const WALKTHROUGH_START = 'WALKTHROUGH_START'
export const WALKTHROUGH_FINISH = 'WALKTHROUGH_FINISH'
export const WALKTHROUGH_NEXT = 'WALKTHROUGH_NEXT'
export const WALKTHROUGH_PREVIOUS = 'WALKTHROUGH_PREVIOUS'

export const actions = {}

actions.start = makeActionCreator(WALKTHROUGH_START, 'steps')
actions.finish = makeActionCreator(WALKTHROUGH_FINISH)
actions.skip = makeActionCreator(WALKTHROUGH_SKIP)

actions.next = makeActionCreator(WALKTHROUGH_NEXT)
actions.previous = makeActionCreator(WALKTHROUGH_PREVIOUS)
