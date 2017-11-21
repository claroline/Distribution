import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {
  Router as BaseRouter,
  Route as BaseRoute,
  Switch
} from 'react-router-dom'

import {history} from '#/main/core/router/history'
import {Route as RouteTypes} from '#/main/core/router/prop-types'

// todo : implement canEnter for security purpose

/**
 * Creates a custom Route component to bind redux action on enter and leave.
 *
 * NB. This is not really aesthetic because component should react to
 * redux and not call it in it's mounting lifecycle.
 */
class Route extends Component {
  constructor(props) {
    super(props)

    if (props.onEnter) {
      props.onEnter(props.computedMatch.params)
    }
  }

  shouldComponentUpdate() {
    // not called on mounting
    return true
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)

    // todo find a way to block mounting (for async)
    if (this.props.location.pathname !== nextProps.location.pathname) {
      // route has changed, call the hooks if any

      // 1. checks if the new route can be entered
      let authorized = true
      if (nextProps.canEnter) {
        authorized = nextProps.canEnter(nextProps.computedMatch.params)
      }

      if (authorized) {
        // 2. leave the old matching route
        if (this.props.onLeave) {
          this.props.onLeave(this.props.computedMatch.params)
        }

        // 3. enter the new matching route
        if (nextProps.onEnter) {
          nextProps.onEnter(nextProps.computedMatch.params)
        }
      } else {
        // cancel navigation
      }
    }
  }

  componentWillUnmount() {
    // todo find a way to block unmounting(for async)
    if (this.props.onLeave) {
      this.props.onLeave(this.props.computedMatch)
    }
  }

  render() {
    return (
      <BaseRoute
        path={this.props.path}
        exact={this.props.exact}
        component={this.props.component}
      />
    )
  }
}

Route.propTypes = RouteTypes.propTypes
Route.defaultProps = RouteTypes.defaultProps

// todo handle hooks on routes group too

const Routes = props =>
  <BaseRoute
    path={props.path}
    exact={props.exact}
  >
    <Switch>
      {props.routes.map((routeConfig, routeIndex) => routeConfig.routes ?
        <Routes
          {...routeConfig}
          key={`route-${routeIndex}`}
        /> :
        <Route
          {...routeConfig}
          key={`route-${routeIndex}`}
          onEnter={routeConfig.onEnter}
          onLeave={routeConfig.onLeave}
        />
      )}
    </Switch>
  </BaseRoute>

Routes.propTypes = {
  path: T.string.isRequired,
  exact: T.bool,
  routes: T.arrayOf(
    T.shape(RouteTypes.propTypes).isRequired // todo : allow more than one nesting in prop-types
  )
}

Routes.defaultProps = RouteTypes.defaultProps

const Router = props =>
  <BaseRouter history={history}>
    <Routes
      path={props.basePath}
      exact={false}
      routes={props.routes}
    />
  </BaseRouter>

Router.propTypes = {
  basePath: T.string,
  routes: T.array.isRequired
}

Router.defaultProps = {
  basePath: '/'
}

export {
  Router,
  Routes,
  Route
}
