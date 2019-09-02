import {selectors as baseSelectors} from '#/main/core/tools/community/store/selectors'

const LIST_NAME = baseSelectors.STORE_NAME + '.users.list'
const FORM_NAME = baseSelectors.STORE_NAME + '.users.current'

export const selectors = {
  LIST_NAME,
  FORM_NAME
}
