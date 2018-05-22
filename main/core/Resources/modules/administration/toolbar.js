/**
 * Administration toolbar.
 *
 * NB.
 * This is a standard app for now because it's out of our main react context.
 * It will be removed when the admin container will be available
 * (only the component will be kept)
 */
import {connect} from 'react-redux'

import {bootstrap} from '#/main/app/bootstrap'
import {makeReducer} from '#/main/app/store/reducer'

import {AdministrationToolbar} from '#/main/core/administration/components/toolbar'
//import {selectors} from '#/main/core/administration/selectors'

bootstrap(
  '.administration-toolbar-container',
  connect(
    () => ({
      /*tools: selectors.tools(state),
      openedTool: selectors.openedTool(state)*/
    })
  )(AdministrationToolbar),
  {
    // the current opened tool
    openedTool: makeReducer(null, {}),

    // the available tools in the administration for the current user
    tools: makeReducer([], {})
  }
)
