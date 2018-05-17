/**
 * A workspace toolbar.
 *
 * NB.
 * This is a standard app for now because it's our main react context.
 * It will be removed when the workspace container will be available
 * (only the component will be kept)
 */

import {bootstrap} from '#/main/app/bootstrap'

import {WorkspaceToolbar} from '#/main/core/workspace/containers/toolbar'
import {reducer} from '#/main/core/workspace/toolbar/reducer'

bootstrap(
  '.workspace-toolbar-container',
  WorkspaceToolbar,
  reducer
)
