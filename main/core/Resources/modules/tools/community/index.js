import {reducer} from '#/main/core/tools/community/store/reducer'
import {UsersTool} from '#/main/core/tools/community/containers/tool'
import {UsersMenu} from '#/main/core/tools/community/containers/menu'

export default {
  component: UsersTool,
  menu: UsersMenu,
  store: reducer
}
