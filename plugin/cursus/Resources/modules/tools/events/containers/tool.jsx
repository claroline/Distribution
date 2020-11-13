import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {actions as listActions} from '#/main/app/content/list/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {actions as eventActions} from '#/plugin/cursus/event/store/actions'
import {EventsTool as EventsToolComponent} from '#/plugin/cursus/tools/events/components/tool'
import {selectors} from '#/plugin/cursus/tools/events/store'

const EventsTool = connect(
  (state) => ({
    path: toolSelectors.path(state),
    contextId: toolSelectors.contextId(state),
    canEdit: hasPermission('edit', toolSelectors.toolData(state)),
    canAdministrate: hasPermission('administrate', toolSelectors.toolData(state))
  }),
  (dispatch) => ({
    open(id) {
      dispatch(eventActions.open(id))
    },
    invalidateList() {
      dispatch(listActions.invalidateData(selectors.LIST_NAME))
    }
  })
)(EventsToolComponent)

export {
  EventsTool
}
