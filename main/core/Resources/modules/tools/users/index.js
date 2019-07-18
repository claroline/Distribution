import {reducer} from '#/main/core/tools/users/store'
import {UsersTool} from '#/main/core/tools/users/containers/tool'
import {UsersMenu} from '#/main/core/tools/users/containers/menu'

/**
 * Users tool application.
 */
export default {
  component: UsersTool,
  menu: UsersMenu,
  store: reducer
}
