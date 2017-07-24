export const CHANGE_ORGANIZATION = 'CHANGE_ORGANIZATION'
import {makeActionCreator} from '#/main/core/utilities/redux'

export const actions = {}

actions.changeOrganization = makeActionCreator(CHANGE_ORGANIZATION, 'organization')
