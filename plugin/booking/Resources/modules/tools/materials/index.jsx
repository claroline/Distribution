import {reducer} from '#/plugin/booking/tools/materials/store'
import {MaterialsTool} from '#/plugin/booking/tools/materials/components/tool'
import {MaterialsMenu} from '#/plugin/booking/tools/materials/containers/menu'

export default {
  component: MaterialsTool,
  menu: MaterialsMenu,
  store: reducer
}
