import {reducer} from '#/main/core/tools/desktop-parameters/store/reducer'
import {Tool} from '#/main/core/tools/desktop-parameters/components/tool'
import {Menu} from '#/main/core/tools/desktop-parameters/components/menu'

export default {
  menu: Menu,
  component: Tool,
  store: reducer
}
