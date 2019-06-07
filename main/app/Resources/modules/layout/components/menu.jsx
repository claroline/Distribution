import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {LINK_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'

import {ToolMenu} from '#/main/core/tool/containers/menu'

const LayoutMenuSection = props =>
  <nav className={classes(props.className, {
    opened: props.opened
  })}>
    <h2 className="h4">
      <Button
        type={CALLBACK_BUTTON}
        icon={props.icon}
        label={props.label}
        callback={props.open}
      />
    </h2>

    {props.opened && props.children}
  </nav>

LayoutMenuSection.propTypes = {
  className: T.string,
  icon: T.string,
  label: T.string,
  opened: T.bool.isRequired,
  children: T.node.isRequired
}

class LayoutMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 'tool'
    }
  }

  render() {
    const props = this.props

    return (
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
          opened={'tool' === props.section}
          open={() => props.changeSection('tool')}
        />

        <LayoutMenuSection
          className="history"
          icon="fa fa-fw fa-history"
          label="Historique"
          opened={'history' === props.section}
          open={() => props.changeSection('history')}
        >
          Mon historique
        </LayoutMenuSection>

        {0 !== props.tools.length &&
          <LayoutMenuSection
            className="tools"
            icon="fa fa-fw fa-tools"
            label={trans('tools')}
            opened={'tools' === props.section}
            open={() => props.changeSection('tools')}
          >
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
          </LayoutMenuSection>
        }

        {0 !== props.actions.length &&
          <LayoutMenuSection
            className="actions"
            icon="fa fa-fw fa-ellipsis-v"
            label={trans('more')}
            opened={'actions' === props.section}
            open={() => props.changeSection('actions')}
          >
            <Toolbar
              className="list-group"
              buttonName="list-group-item"
              actions={props.actions}
            />
          </LayoutMenuSection>
        }
      </aside>
    )
  }
}


LayoutMenu.propTypes = {
  title: T.string,
  backAction: T.shape(ActionTypes.propTypes),

  tools: T.arrayOf(T.shape({

  })),
  actions: T.arrayOf(T.shape({

  })),

  children: T.node,

  section: T.oneOf(['tool', 'history', 'tools', 'actions']),
  changeSection: T.func.isRequired
}

LayoutMenu.defaultProps = {
  tools: [],
  actions: []
}

export {
  LayoutMenu
}
