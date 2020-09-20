import {reducer} from '#/plugin/cursus/tools/trainings/store'
import {CursusTool} from '#/plugin/cursus/tools/trainings/components/tool'
import {CursusMenu} from '#/plugin/cursus/tools/trainings/components/menu'

export default {
  component: CursusTool,
  menu: CursusMenu,
  store: reducer
}
