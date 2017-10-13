import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, trans} from '#/main/core/translation'

import {Router} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {Menu} from './menu.jsx'
//import {Announces} from './announces.jsx'
//import {Announce} from './announce.jsx'
//import {AnnounceForm} from './announce-form.jsx'

//import {Announcement as AnnouncementTypes} from './../prop-types'
//import {select} from './../selectors.js'
//import {actions} from './../actions.js'

const DropzoneResource = props =>
  <ResourceContainer
    editor={{
      opened: false,
      open: '#/edit',
      icon: 'fa fa-pencil',
      label: t('configure'),
      save: {
        disabled: false,
        action: '#/'
      }
    }}
    customActions={[
      {
        icon: 'fa fa-fw fa-list',
        label: trans('menu', {}, 'dropzone'),
        action: '#/'
      }
    ]}
  >
    <Router
      routes={[
        {
          path: '/',
          component: Menu
        }
      ]}
    />
  </ResourceContainer>

DropzoneResource.propTypes = {
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const ConnectedDropzoneResource = connect(mapStateToProps, mapDispatchToProps)(DropzoneResource)

export {
  ConnectedDropzoneResource as DropzoneResource
}
