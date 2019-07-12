import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Profile} from '#/main/core/user/profile/containers/main.jsx'
import {ToolPage} from '#/main/core/tool/containers/page'
import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'
import {selectors} from '#/main/app/content/details/store'

const UsersTool = (props) =>
  <ToolPage
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/profile', render: () => trans('profile'), disabled: false},
          {path: '/list',    render: () => trans('users'), disabled: false}
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/profile/:publicUrl',
          render: () => {
            const ProfileComponent = <Profile path={props.path + '/profile/' + props.user.publicUrl}/>

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
    />
  </ToolPage>

const ConnectedTool = withRouter(
  connect(
    (state) => {
      return {
        user: selectors.data(selectors.details(state, 'users.user'))
      }
    }
  )(UsersTool)
)

UsersTool.propTypes = {
  path: T.string.isRequired,
  user: T.object
}

export {
  ConnectedTool as UsersTool
}
