import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import omit from 'lodash/omit'

import Panel      from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

const SectionIcon = props =>
  <span
    className={props.icon ? props.icon : classes('fa fa-fw', {
      'fa-caret-down': props.expanded,
      'fa-caret-right': !props.expanded
    })}
    style={{marginRight: 10}}
  />

SectionIcon.propTypes = {
  icon: T.string,
  expanded: T.bool
}

SectionIcon.defaultProps = {
  expanded: false
}

/**
 * Renders a section.
 *
 * @param props
 * @constructor
 */
const Section = props =>
  <Panel
    {...omit(props, ['level', 'title', 'icon', 'children'])}

    collapsible={true}
    header={
      React.createElement('h'+props.level, {
        className: classes({opened: props.expanded})
      }, [
        <SectionIcon key="panel-icon" icon={props.icon} expanded={props.expanded} />,
        props.title
      ])
    }
  >
    {props.children}
  </Panel>

Section.propTypes = {
  id: T.string.isRequired,
  level: T.number,
  icon: T.string,
  title: T.string.isRequired,
  expanded: T.bool,
  children: T.node.isRequired
}

const Sections = props =>
  <PanelGroup
    accordion={props.accordion}
    defaultActiveKey={props.defaultOpened}
  >
    {React.Children.map(props.children, (child, index) =>
      React.cloneElement(child, {
        key: index,
        eventKey: index,
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
