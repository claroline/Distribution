import {decorate} from '#/main/core/user/profile/decorator'

import {reducer} from '#/main/core/administration/users/store/reducer'
import {UserTool} from '#/main/core/administration/users/components/tool'

/**
 * Users tool application.
 */
export default {
  component: UserTool,
  //menu: WorkspacesMenu,
  store: reducer
}
