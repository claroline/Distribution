import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as detailsSelectors} from '#/main/app/content/details/store'

import {RoomDetails as RoomDetailsComponent} from '#/plugin/booking/tools/booking/room/components/details'
import {selectors} from '#/plugin/booking/tools/booking/room/store'

const RoomDetails = connect(
  (state) => ({
    path: toolSelectors.path(state),
    room: detailsSelectors.data(detailsSelectors.details(state, selectors.FORM_NAME))
  })
)(RoomDetailsComponent)

export {
  RoomDetails
}
