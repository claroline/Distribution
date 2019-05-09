import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {LINK_BUTTON} from '#/main/app/buttons'

import {ToolMenu} from '#/main/core/tool/containers/menu'

const LayoutMenu = props =>
  <aside className="app-menu">
    <header className="app-menu-header">
      {props.backAction &&
        <Button
          {...props.backAction}
          className="app-menu-back"
          icon="fa fa-angle-double-left"
          tooltip="right"
        />
      }

      {props.title &&
        <h1 className="app-menu-title h5">{props.title}</h1>
      }
    </header>

    {props.children}

    <ToolMenu
      basePath="/desktop"
    />

    <nav>
      <h2 className="h4">
        <span className="fa fa-fw fa-history icon-with-text-right" />
        Historique
      </h2>
    </nav>

    {0 !== props.tools.length &&
      <nav>
        <h2 className="h4">
          <span className="fa fa-fw fa-tools icon-with-text-right" />
          {trans('tools')}
        </h2>

        <Toolbar
          className="list-group"
          buttonName="list-group-item"
          actions={props.tools.map((tool) => ({
            name: tool.name,
            type: LINK_BUTTON,
            icon: `fa fa-fw fa-${tool.icon}`,
            label: trans(tool.name, {}, 'tools'),
            target: `/desktop/${tool.name}`
          }))}
        />
      </nav>
    }

    {0 !== props.actions.length &&
      <nav>
        <h2 className="h4">
          <span className="fa fa-fw fa-ellipsis-v icon-with-text-right"/>
          {trans('more')}
        </h2>

        <Toolbar
          className="list-group"
          buttonName="list-group-item"
          actions={props.actions}
        />
      </nav>
    }
  </aside>

LayoutMenu.propTypes = {
  title: T.string,
  backAction: T.shape(ActionTypes.propTypes),

  tools: T.arrayOf(T.shape({

  })),
  actions: T.arrayOf(T.shape({

  })),

  children: T.node
}

LayoutMenu.defaultProps = {
  tools: [],
  actions: []
}

export {
  LayoutMenu
}
