import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {RoomsTool as RoomsToolComponent} from '#/plugin/booking/tools/rooms/components/menu'

const RoomsTool = connect(
  (state) => ({
    editable: hasPermission('edit', toolSelectors.toolData(state))
  })
)(RoomsToolComponent)

export {
  RoomsTool
}
