import {selectors as baseSelectors} from '#/main/core/tools/community/store/selectors'

import {getPermissionLevel} from '#/main/core/tools/community/permissions'
import {constants} from '#/main/core/tools/community/constants'

const LIST_NAME = baseSelectors.STORE_NAME + '.users.list'
const FORM_NAME = baseSelectors.STORE_NAME + '.users.current'

export const selectors = {
  LIST_NAME,
  FORM_NAME
}
