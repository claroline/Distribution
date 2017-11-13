import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import omit from 'lodash/omit'

import Panel      from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

import {Action as ActionTypes} from '#/main/core/layout/button/prop-types'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

/**
 * Renders a section.
 *
 * @param props
 * @constructor
 */
const Section = props =>
  <Panel
    {...omit(props, ['level', 'title', 'icon', 'actions', 'children'])}

    collapsible={true}
    header={
      React.createElement('h'+props.level, {
        className: classes({opened: props.expanded})
      }, [
        props.icon && <span key="panel-icon" className={props.icon} style={{marginRight: 10}} />,
        props.title,
        0 !== props.actions.length &&
        <div key="panel-actions" className="panel-actions">
          {props.actions.map((action, actionIndex) =>
            <TooltipAction
              {...action}

              key={`${props.id}-action-${actionIndex}`}
              id={`${props.id}-action-${actionIndex}`}
              className={classes({
                'btn-link-default': !action.primary && !action.dangerous,
                'btn-link-danger': action.dangerous,
                'btn-link-primary': action.primary
              })}
            />
          )}
        </div>
      ])
    }
  >
    {props.children}
  </Panel>

Section.propTypes = {
  id: T.string.isRequired,
  level: T.number.isRequired,
  icon: T.string,
  title: T.node.isRequired,
  expanded: T.bool,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  children: T.node.isRequired
}

Section.defaultProps = {
  actions: []
}

const Sections = props =>
  <PanelGroup
    accordion={props.accordion}
    defaultActiveKey={props.defaultOpened}
  >
    {React.Children.map(props.children, (child, index) => 'hr' === child.type ? child :
      React.cloneElement(child, {
        key: child.props.id,
        eventKey: child.props.id,
        level: props.level
      })
    )}
  </PanelGroup>

Sections.propTypes = {
  accordion: T.bool,
  level: T.number, // level for panel headings
  defaultOpened: T.string,
  children: T.node.isRequired
}

Sections.defaultProps = {
  accordion: true,
  level: 5
}

export {
  Section,
  Sections
}
