import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'
import {MenuSection} from '#/main/app/layout/menu/components/section'

const WorkspacesMenu = (props) =>
  <MenuSection
    {...omit(props, 'path', 'creatable')}
    title={trans('workspaces', {}, 'tools')}
  >
    <div className="list-group">
      <Button
        className="list-group-item"
        type={LINK_BUTTON}
        label={trans('my_workspaces', {}, 'workspace')}
        target={`${props.path}/registered`}
      />

      <Button
        className="list-group-item"
        type={LINK_BUTTON}
        label={trans('public_workspaces', {}, 'workspace')}
        target={`${props.path}/public`}
      />

      <Button
        className="list-group-item"
        type={LINK_BUTTON}
        label={trans('managed_workspaces', {}, 'workspace')}
        target={`${props.path}/managed`}
      />

      {props.creatable &&
        <Button
          className="list-group-item"
          type={LINK_BUTTON}
          label={trans('workspace_models', {}, 'workspace')}
          target={`${props.path}/model`}
        />
      }

      {props.creatable &&
        <Button
          className="list-group-item"
          type={LINK_BUTTON}
          icon="fa fa-fw fa-plus"
          label={trans('create_workspace', {}, 'workspace')}
          target={`${props.path}/new`}
        />
      }
    </div>
  </MenuSection>

WorkspacesMenu.propTypes = {
  path: T.string,
  creatable: T.bool.isRequired
}

export {
  WorkspacesMenu
}
