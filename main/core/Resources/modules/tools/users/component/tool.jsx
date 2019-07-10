import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool/containers/page'

// TODO : redirect to public list if user is not registered

const UsersTool = (props) =>
  <ToolPage
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/profile',        render: () => trans('new_workspace', {}, 'workspace'), disabled: false},
          {path: '/list', render: () => trans('my_workspaces', {}, 'workspace'), disabled: false}
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/profile',
          render: () => {
            return(<div>profile</div>)
          }
        }, {
          path: '/list',
          render: () => {
            return(<div>list</div>)
          }
        }
      ]}

      redirect={[
        {from: '/', exact: true, to: '/profile'}
      ]}
    />
  </ToolPage>

UsersTool.propTypes = {
  path: T.string.isRequired
}

export {
  UsersTool
}
