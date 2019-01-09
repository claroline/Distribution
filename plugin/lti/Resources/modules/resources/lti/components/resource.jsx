import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {ResourcePage} from '#/main/core/resource/containers/page'

// import {Scorm as ScormType} from '#/plugin/scorm/resources/scorm/prop-types'
import {Player} from '#/plugin/lti/resources/lti/player/components/player'
import {Editor} from '#/plugin/lti/resources/lti/editor/components/editor'

const LtiResource = props =>
  <ResourcePage
    // styles={['claroline-distribution-plugin-scorm-resource']}
    // customActions={[
    //   {
    //     type: LINK_BUTTON,
    //     icon: 'fa fa-fw fa-play',
    //     label: trans('play_scorm', {}, 'scorm'),
    //     target: '/play',
    //     exact: true
    //   }, {
    //     type: LINK_BUTTON,
    //     icon: 'fa fa-fw fa-list',
    //     label: trans('results_list', {}, 'scorm'),
    //     disabled: !props.editable,
    //     displayed: props.editable,
    //     target: '/results',
    //     exact: true
    //   }
    // ]}
  >
    <Routes
      key="resource-content"
      redirect={[
        {from: '/', exact: true, to: '/play'}
      ]}
      routes={[
        {
          path: '/play',
          component: Player
        }, {
          path: '/edit',
          component: Editor,
          disabled: !props.editable,
          onLeave: () => props.resetForm(),
          onEnter: () => props.resetForm(props.ltiResource)
        }
      ]}
    />
  </ResourcePage>

LtiResource.propTypes = {
  // ltiResource: T.shape(ScormType.propTypes),
  editable: T.bool.isRequired,
  resetForm: T.func.isRequired
}

export {
  LtiResource
}
