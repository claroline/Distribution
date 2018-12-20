import {connect} from 'react-redux'

import {OpenBadgeAdminTool as OpenBadgeAdminToolComponent} from '#/plugin/open-badge/tools/badges/components/tool'

const ConnectedOpenBadgeAdminTool = connect(
  state => ({
    context: state.context
  }),
  null
)(OpenBadgeAdminToolComponent)

export {
  ConnectedOpenBadgeAdminTool as OpenBadgeAdminTool
}
