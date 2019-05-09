import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'

const WorkspacesMenu = (props) =>
  <div className="list-group">
    <Button
      className="list-group-item"
      type={LINK_BUTTON}
      label={trans('my_workspaces', {}, 'workspace')}
      target="/desktop/workspaces/registered"
    />

    <Button
      className="list-group-item"
      type={LINK_BUTTON}
      label={trans('public_workspaces', {}, 'workspace')}
      target="/desktop/workspaces/public"
    />

    <Button
      className="list-group-item"
      type={LINK_BUTTON}
      label={trans('managed_workspaces', {}, 'workspace')}
      target="/desktop/workspaces/managed"
    />

    {props.creatable &&
      <Button
        className="list-group-item"
        type={LINK_BUTTON}
        label={trans('workspace_models', {}, 'workspace')}
        target="/desktop/workspaces/model"
      />
    }

    {props.creatable &&
      <Button
        className="list-group-item"
        type={LINK_BUTTON}
        icon="fa fa-fw fa-plus"
        label={trans('create_workspace', {}, 'workspace')}
        target="/desktop/workspaces/new"
      />
    }
  </div>

WorkspacesMenu.propTypes = {
  creatable: T.bool.isRequired
}

export {
  WorkspacesMenu
}
