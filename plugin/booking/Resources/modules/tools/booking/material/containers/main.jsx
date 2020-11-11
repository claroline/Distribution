import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {MaterialMain as MaterialMainComponent} from '#/plugin/booking/tools/booking/material/components/main'
import {actions} from '#/plugin/booking/tools/booking/material/store'

const MaterialMain = connect(
  (state) => ({
    path: toolSelectors.path(state),
    editable: hasPermission('edit', toolSelectors.toolData(state))
  }),
  (dispatch) => ({
    open(id) {
      dispatch(actions.open(id))
    }
  })
)(MaterialMainComponent)

export {
  MaterialMain
}
