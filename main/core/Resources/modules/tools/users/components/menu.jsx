import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'
import {selectors} from '#/main/app/content/details/store'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {MenuSection} from '#/main/app/layout/menu/components/section'

const UsersMenu = (props) =>
  <MenuSection
    title={trans('users', {}, 'tools')}
  >
    <Toolbar
      className="list-group"
      buttonName="list-group-item"
      actions={[
        {
          name: 'profile',
          type: LINK_BUTTON,
          label: trans('profile'),
          target: props.path+'/profile/' + props.user.publicUrl
        }, {
          name: 'users',
          type: LINK_BUTTON,
          label: trans('list'),
          target: props.path+'/list'
        }
      ]}
    />
  </MenuSection>

const ConnectedMenu = withRouter(
  connect(
    (state) => {
      return {
        user: selectors.data(selectors.details(state, 'users.user'))
      }
    }
  )(UsersMenu)
)


UsersMenu.propTypes = {
  user: T.object,
  path: T.string
}

export {
  ConnectedMenu as UsersMenu
}
