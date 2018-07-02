
import {makeActionCreator} from '#/main/app/store/actions'

// action names
export const RESOURCE_UPDATE_RIGHTS = 'RESOURCE_UPDATE_RIGHTS'

// action creators
export const actions = {}

actions.update = makeActionCreator(RESOURCE_UPDATE_RIGHTS, 'permissions')
