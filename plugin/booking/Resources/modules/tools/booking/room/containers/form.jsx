import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as formSelectors} from '#/main/app/content/form/store'

import {RoomForm as RoomFormComponent} from '#/plugin/booking/tools/booking/room/components/form'
import {selectors} from '#/plugin/booking/tools/booking/room/store'

const RoomForm = connect(
  (state) => ({
    path: toolSelectors.path(state),
    room: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME))
  })
)(RoomFormComponent)

export {
  RoomForm
}
