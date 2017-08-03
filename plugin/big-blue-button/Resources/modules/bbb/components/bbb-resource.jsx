import React from 'react'
import {PropTypes as T} from 'prop-types'
import {Route, Switch, withRouter} from 'react-router-dom'
import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {BBBContent} from './bbb-content.jsx'
import {BBBConfig} from './bbb-config.jsx'

const BBBResource = props =>
  <ResourceContainer
    edit="#/edit"
    editMode={'/edit' === props.location.pathname}
    save={{
      disabled: false,
      action: () => {}
    }}
    customActions={[]}
  >
    <Switch>
      <Route path="/" component={BBBContent} exact={true} />
      <Route path="/edit" component={BBBConfig} />
    </Switch>
  </ResourceContainer>


BBBResource.propTypes = {
  location: T.shape({
    pathname: T.string.isRequired
  }).isRequired
}

const RoutedBBBResource = withRouter(BBBResource)

export {RoutedBBBResource as BBBResource}