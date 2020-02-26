import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {ToolPage} from '#/main/core/tool/containers/page'
import {Archive} from '#/main/core/administration/parameters/archive/containers/archive'
import {Meta} from '#/main/core/administration/parameters/main/containers/meta'
import {I18n} from '#/main/core/administration/parameters/language/containers/i18n'
import {Plugins} from '#/main/core/administration/parameters/plugin/containers/plugins'
import {Messages} from '#/main/core/administration/parameters/message/components/messages'
import {Message} from '#/main/core/administration/parameters/message/containers/message'
import {Technical} from '#/main/core/administration/parameters/technical/containers/technical'
import {AppearanceMain} from '#/main/core/administration/parameters/appearance/containers/main'
import {IconsMain} from '#/main/core/administration/parameters/icon/containers/main'

const ParametersTool = (props) => {
  const parametersActions = []

  switch (props.location.pathname) {
    case props.path+'/messages':
      parametersActions.push({
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_connection_message'),
        target: props.path+'/messages/form',
        primary: true
      })
      break
    case props.path+'/icons':
      parametersActions.push({
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_icon_set'),
        target: props.path+'/icons/form',
        primary: true
      })
      break
  }

  return (
    <ToolPage
      className="main-settings-container"
      actions={parametersActions}
      subtitle={
        <Routes
          path={props.path}
          routes={[
            {path: '/', exact: true, render: () => trans('general')},
            {path: '/i18n',          render: () => trans('language')},
            {path: '/plugins',       render: () => trans('plugins')},
            {path: '/archives',      render: () => trans('archive')},
            {path: '/messages',      render: () => trans('connection_messages')},
            {path: '/technical',     render: () => trans('technical')},
            {path: '/appearance',    render: () => trans('appearance')},
            {path: '/icons',         render: () => trans('icons')}
          ]}
        />
      }
    >
      <Routes
        path={props.path}
        routes={[
          {
            path: '/',
            exact: true,
            component: Meta
          }, {
            path: '/i18n',
            component: I18n
          }, {
            path: '/plugins',
            component: Plugins
          }, {
            path: '/archives',
            component: Archive
          }, {
            path: '/messages',
            exact: true,
            render() {
              const MessagesList = (
                <Messages
                  path={props.path}
                />
              )

              return MessagesList
            }
          }, {
            path: '/messages/form/:id?', // TODO : should be declared in messages submodule
            component: Message,
            onEnter: (params) => props.openConnectionMessageForm(params.id),
            onLeave: () => props.resetConnectionMessageFrom()
          }, {
            path: '/technical',
            component: Technical
          }, {
            path: '/appearance',
            component: AppearanceMain
          }, {
            path: '/icons',
            component: IconsMain
          }
        ]}
      />
    </ToolPage>
  )
}

ParametersTool.propTypes = {
  path: T.string,
  location: T.shape({
    pathname: T.string
  }),
  openConnectionMessageForm: T.func.isRequired,
  resetConnectionMessageFrom: T.func.isRequired
}

export {
  ParametersTool
}
