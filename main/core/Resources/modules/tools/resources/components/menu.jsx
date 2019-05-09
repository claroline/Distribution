import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'

import {ToolMenu} from '#/main/core/tool/containers/menu'

function summaryLink(directory) {
  return {
    type: LINK_BUTTON,
    id: directory.id,
    icon: directory._opened ? 'fa fa-fw fa-folder-open' : 'fa fa-fw fa-folder',
    label: directory.name,
    collapsed: !directory._opened,
    collapsible: !directory._loaded || (directory.children && 0 !== directory.children.length),
    toggleCollapse: (collapsed) => props.toggleDirectoryOpen(directory, !collapsed),
    target: `${props.basePath}/${directory.id}`,
    children: directory.children ? directory.children.map(summaryLink) : []
  }
}

const ResourcesMenu = (props) =>
  <div>
    resources menu
  </div>

ResourcesMenu.propTypes = {
  basePath: T.string.isRequired
}

ResourcesMenu.defaultProps = {

}

export {
  ResourcesMenu
}
