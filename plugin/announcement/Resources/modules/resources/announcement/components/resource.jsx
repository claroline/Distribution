import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {Announces} from './announces.jsx'
import {Announce} from './announce.jsx'
import {AnnounceForm} from './announce-form.jsx'

// <Route path="/add" component={AnnounceForm} exact={true} />
// <Route path="/:id/edit" component={AnnounceForm} exact={true} />

const AnnouncementResource = props =>
  <Router>
    <ResourceContainer>
      <Switch>
        <Route path="/" component={Announces} exact={true} />
        <Route path="/:id" component={Announce} />

      </Switch>
    </ResourceContainer>
  </Router>

export {
  AnnouncementResource
}
