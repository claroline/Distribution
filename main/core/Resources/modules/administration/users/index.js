import {decorate} from '#/main/core/user/profile/decorator'

import {reducer} from '#/main/core/administration/users/store/reducer'
import {UsersTool} from '#/main/core/administration/users/components/tool'

/**
 * Users tool application.
 */
export default {
  component: UsersTool,
  //menu: WorkspacesMenu,
  store: reducer
}
