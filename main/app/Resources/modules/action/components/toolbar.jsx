import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'

import {Await} from '#/main/app/components/await'
import {Button} from '#/main/app/action/components/button'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

import {buildToolbar} from '#/main/app/action/utils'

/**
 * Creates a toolbar of actions.
 *
 * @param props
 * @constructor
 */
const StaticToolbar = props => {
  const toolbar = buildToolbar(props.toolbar, props.actions)

  return (0 !== toolbar.length &&
    <nav role="toolbar" className={props.className}>
      {toolbar.map((group, groupIndex) => [
        0 !== groupIndex &&
          <span
            key={`separator-${groupIndex}`}
            className={`${props.className}-separator`}
          />,
        ...group.map((action) =>
          <Button
            {...omit(action, 'name')}
            id={`${props.id}${action.id || action.name}`}
            key={action.id || action.name}
            className={classes(`${props.className}-btn`, props.buttonName)}
            tooltip={props.tooltip}
          />
        )
      ])}
    </nav>
  ) || null
}

StaticToolbar.propTypes = {

}

class PromisedToolbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      actions: []
    }
  }

  render() {
    return (
      <Await
        for={this.props.actions}
        then={actions => this.setState({actions: actions})}
        placeholder={
          <div className={this.props.className}>
            <span className={classes(`${this.props.className}-btn`, this.props.buttonName, 'default')}>
              <span className="fa fa-fw fa-spinner fa-spin" />
            </span>
          </div>
        }
      >
        <StaticToolbar {...this.props} actions={this.state.actions} />
      </Await>
    )
  }
}


const Toolbar = props => {
  //console.log(props.actions)

  return props.actions instanceof Promise ?
    <PromisedToolbar {...props} /> :
    <StaticToolbar {...props} />
}

Toolbar.propTypes = {
  id: T.string,

  /**
   * The base class of the toolbar (it's used to generate classNames which can be used for styling).
   */
  className: T.string,

  /**
   * The base class for buttons.
   */
  buttonName: T.string,

  /**
   * The toolbar display configuration as a string.
   */
  toolbar: T.string,
  tooltip: T.oneOf(['left', 'top', 'right', 'bottom']),
  actions: T.arrayOf(T.shape(
    merge({}, ActionTypes.propTypes, {
      name: T.string
    })
  )).isRequired
}

Toolbar.defaultProps = {
  className: 'toolbar',
  tooltip: 'bottom',
  collapsed: false
}

export {
  Toolbar
}
