import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Profile} from '#/main/core/tools/users/components/profile/containers/main.jsx'
import {ToolPage} from '#/main/core/tool/containers/page'

const UsersTool = (props) =>
  <ToolPage
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/profile',        render: () => trans('profile'), disabled: false},
          {path: '/list', render: () => trans('users'), disabled: false}
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
            return (<Profile/>)
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
