import {reducer} from '#/plugin/booking/tools/rooms/store'
import {RoomsTool} from '#/plugin/booking/tools/rooms/components/tool'
import {RoomsMenu} from '#/plugin/booking/tools/rooms/containers/menu'

export default {
  component: RoomsTool,
  menu: RoomsMenu,
  store: reducer
}
