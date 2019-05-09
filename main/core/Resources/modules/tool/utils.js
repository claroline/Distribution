import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {constants} from '#/main/core/tool/constants'
import {currentUser} from '#/main/app/security'

/**
 * Gets the path of a tool based on its rendering context.
 *
 * @param {string} toolName
 * @param {string} contextType
 * @param {object} contextData
 *
 * @return {Array}
 */
function getToolPath(toolName, contextType, contextData = {}) {
  const user = currentUser()
  const breadcrumbItems = get(contextData, 'breadcrumb.items') || []

  let path = []

  switch (contextType) {
    case constants.TOOL_DESKTOP:
      path = [
        {
          type: LINK_BUTTON,
          label: trans('desktop'),
          target: '/desktop'
        }, {
          type: LINK_BUTTON,
          label: trans(toolName, {}, 'tools'),
          target: '/desktop/' + toolName
        }
      ]
      break

    case constants.TOOL_WORKSPACE:
      if (user) {
        path = [
          {
            type: LINK_BUTTON,
            label: trans('desktop'),
            displayed: -1 !== breadcrumbItems.indexOf('desktop'),
            target: '/desktop'
          }, {
            type: LINK_BUTTON,
            label: trans('my_workspaces', {}, 'workspace'),
            displayed: -1 !== breadcrumbItems.indexOf('workspaces'),
            target: '/desktop/workspaces'
          }
        ]
      } else {
        path = [
          {
            type: LINK_BUTTON,
            label: trans('public_workspaces', {}, 'workspace'),
            displayed: -1 !== breadcrumbItems.indexOf('workspaces'),
            target: '/desktop/workspaces'
          }
        ]
      }

      path = path.concat([
        {
          type: LINK_BUTTON,
          label: contextData.name,
          displayed: -1 !== breadcrumbItems.indexOf('current'),
          target: '/desktop/workspaces/' + contextData.id
        }, {
          type: LINK_BUTTON,
          label: trans(toolName, {}, 'tools'),
          displayed: -1 !== breadcrumbItems.indexOf('tool'),
          target: '/desktop/workspaces/' + contextData.id + '/' + toolName
        }
      ])
      break

    case constants.TOOL_ADMINISTRATION:
      path = [
        {
          type: LINK_BUTTON,
          label: trans('administration'),
          target: '/administration'
        }, {
          type: LINK_BUTTON,
          label: trans(toolName, {}, 'tools'),
          target: '/administration/' + toolName
        }
      ]
      break
  }

  return path
}

function showToolBreadcrumb(contextType, contextData) {
  if (constants.TOOL_WORKSPACE === contextType) {
    return !!get(contextData, 'breadcrumb.displayed')
  }

  return true
}

export {
  getToolPath,
  showToolBreadcrumb
}
