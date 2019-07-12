import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Profile} from '#/main/core/user/profile/containers/main.jsx'
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
            const ProfileComponent = <Profile/>

            return ProfileComponent
          }
        }, {
          path: '/list',
          render: () => {
            const ListComponent = <div>list</div>

            return ListComponent
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
