import {makeActionCreator} from '#/main/app/store/actions'

export const RESOURCE_OPEN = 'RESOURCE_OPEN'

export const actions = {}

actions.openResource = makeActionCreator(RESOURCE_OPEN, 'resourceNode')
