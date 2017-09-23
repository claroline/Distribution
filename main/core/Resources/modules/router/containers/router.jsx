import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {
  HashRouter as Router,
  Route as BaseRoute,
  Switch,
  withRouter
} from 'react-router-dom'

import {Route as RouteTypes} from '#/main/core/router/prop-types'

const Route = props =>
  <BaseRoute
    path={props.path}
    exact={props.exact}
    component={props.component}
    onEnter={() => {
      console.log('enter route')
      props.onEnter(...args)
    }}
    onLeave={props.onLeave}
  />

Route.propTypes = RouteTypes.propTypes
Route.defaultProps = RouteTypes.defaultProps

const Routes = props =>
  <BaseRoute
    key={props.path}
    path={props.path}
  >
    <Switch>
      {props.routes.map(routeConfig => routeConfig.routes ?
        <Routes
          {...routeConfig}
          key={props.path}
          dispatchRouteAction={props.dispatchRouteAction}
        /> :
        <Route
          {...routeConfig}
          key={props.path}
          onEnter={routeConfig.onEnterAction ? () => props.dispatchRouteAction(routeConfig.onEnterAction(...args)) : undefined}
          onLeave={routeConfig.onLeaveAction ? () => props.dispatchRouteAction(routeConfig.onLeaveAction(...args)) : undefined}
        />
      )}
    </Switch>
  </BaseRoute>

Routes.propTypes = {
  path: T.string.isRequired,
  routes: T.arrayOf(
    T.shape(RouteTypes.propTypes).isRequired // todo : allow more than one nesting in prop-types
  ),
  dispatchRouteAction: T.func.isRequired
}

Routes.defaultProps = RouteTypes.defaultProps

class CustomRouter extends Component {
  constructor(props) {
    super(props)

    // register to history changes to dispatch correct actions
    this.props.history.listen(this.props.routeChange);
  }

  render() {
    return (
      <Routes
        path={this.props.basePath}
        routes={this.props.routes}
        dispatchRouteAction={this.props.dispatchRouteAction}
      />
    )
  }
}

CustomRouter.propTypes = {
  basePath: T.string,
  routes: T.array.isRequired,
  dispatchRouteAction: T.func.isRequired,
  routeChange: T.func.isRequired
}

CustomRouter.defaultProps = {
  basePath: ''
}

function mapDispatchToProps(dispatch) {
  return {
    routeChange(newLocation, action) {
      console.log('mapDispatchToProps:routeChange')
      /*dispatch(routeLocationDidUpdate(location, action))*/
    },

    dispatchRouteAction(action) {
      console.log('mapDispatchToProps:dispatchRouteAction')
      dispatch(action)
    }
  }
}

const ConnectedRouter = withRouter(connect(null, mapDispatchToProps)(CustomRouter))

const RouterContainer = props =>
  <Router>
    <ConnectedRouter {...props} />
  </Router>

export {
  RouterContainer
}