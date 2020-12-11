import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {MenuSection} from '#/main/app/layout/menu/components/section'

import {EditorMenu} from '#/plugin/home/tools/home/editor/containers/menu'
import {PlayerMenu} from '#/plugin/home/tools/home/player/containers/menu'

const HomeMenu = props =>
  <MenuSection
    className="home-menu"
    {...omit(props, 'path', 'canEdit')}
    title={trans('home', {}, 'tools')}
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/edit',
          disabled: !props.canEdit,
          render() {
            const Menu = (
              <EditorMenu autoClose={props.autoClose} />
            )

            return Menu
          }
        }, {
          path: '/',
          render() {
            const Menu = (
              <PlayerMenu autoClose={props.autoClose} />
            )

            return Menu
          }
        }
      ]}
    />
  </MenuSection>

HomeMenu.propTypes = {
  path: T.string.isRequired,
  canEdit: T.bool.isRequired,

  // from menu
  opened: T.bool.isRequired,
  toggle: T.func.isRequired,
  autoClose: T.func.isRequired
}

export {
  HomeMenu
}
