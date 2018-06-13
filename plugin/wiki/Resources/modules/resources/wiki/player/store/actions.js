import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const UPDATE_EDIT_SECTION = 'UPDATE_EDIT_SECTION'
export const SECTION_UPDATE = 'SECTION_UPDATE'
export const SECTION_CREATE = 'CREATE_SECTION'

export const actions = {}

actions.updateEditSection = makeActionCreator(UPDATE_EDIT_SECTION, 'sectionId')
actions.sectionUpdate = makeActionCreator(SECTION_UPDATE, 'section')
actions.sectionCreate = makeActionCreator(SECTION_CREATE, 'section')

actions.addSection = (parentId) => (dispatch) => {
  dispatch(actions.sectionCreate(parentId))
}