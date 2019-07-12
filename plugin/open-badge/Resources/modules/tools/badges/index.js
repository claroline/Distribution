
import {OpenBadgeTool} from '#/plugin/open-badge/tools/badges/containers/tool'

import {reducer} from '#/main/core/tools/workspaces/store'

/**
 * OpenBadge tool application.
 */
export default {
  component: OpenBadgeTool,
  store: reducer
}
