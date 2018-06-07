import {findInTree} from '#/plugin/wiki/resources/wiki/utils'

const section = (state, id) => {
  return findInTree(state.sectionTree, id, 'children', 'id')
}

export const selectors = {
  section
}