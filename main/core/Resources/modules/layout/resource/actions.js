import {makeActionCreator} from '#/main/core/utilities/redux'

export const RESOURCE_PUBLICATION_TOGGLE = 'RESOURCE_PUBLICATION_CHANGE'
export const RESOURCE_UPDATE_PROPERTIES  = 'RESOURCE_UPDATE_PROPERTIES'
export const RESOURCE_UPDATE_RIGHTS      = 'RESOURCE_UPDATE_RIGHTS'

export const actions = {}

actions.togglePublication = makeActionCreator(RESOURCE_PUBLICATION_TOGGLE)

// Properties management
actions.updateProperties  = makeActionCreator(RESOURCE_UPDATE_PROPERTIES, 'resourceNode')

// Rights management
actions.updateRights      = makeActionCreator(RESOURCE_UPDATE_RIGHTS, 'rights')
