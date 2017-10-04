import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import {trans} from '#/main/core/translation'

import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {Announces} from './announces.jsx'
import {Announce} from './announce.jsx'
import {AnnounceForm} from './announce-form.jsx'

const AnnouncementResource = props =>
  <ResourceContainer
    editor={{
      opened: false,
      open: '#/add',
      icon: ' fa fa-plus',
      label: trans('add_announce', {}, 'announcement'),
      save: {
        disabled: false,
        action: () => true
      }
    }}
  >
    <Router>
      <Switch>
        <Route path="/" component={Announces} exact={true} />
        <Route path="/add" component={AnnounceForm} exact={true} />
        <Route path="/:id" component={Announce} exact={true} />
        <Route path="/:id/edit" component={AnnounceForm} exact={true} />
      </Switch>
    </Router>
  </ResourceContainer>

export {
  AnnouncementResource
}
