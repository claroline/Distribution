import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {Router} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {Announces} from './announces.jsx'
import {Announce} from './announce.jsx'
import {AnnounceForm} from './announce-form.jsx'

import {Announcement as AnnouncementTypes} from './../prop-types'
import {select} from './../selectors.js'
import {actions} from './../actions.js'

const AnnouncementResource = props =>
  <ResourceContainer
    editor={{
      opened: props.formOpened,
      open: '#/add',
      icon: 'fa fa-plus',
      label: trans('add_announce', {}, 'announcement'),
      save: {
        disabled: !props.formPendingChanges,
        action: () => props.save(props.formData)
      }
    }}
    customActions={[
      {
        icon: 'fa fa-fw fa-list',
        label: trans('announcements_list', {}, 'announcement'),
        action: '#/'
      }
    ]}
  >
    <Router
      routes={[
        {
          path: '/',
          component: Announces
        }, {
          path: '/add',
          component: AnnounceForm,
          onEnter: () => props.openForm(AnnouncementTypes.defaultProps),
          onLeave: props.resetForm
        }, {
          path: '/:id',
          component: Announce,
          onEnter: (params) => props.openDetail(params.id)
        }, {
          path: '/:id/edit',
          component: AnnounceForm,
          onEnter: (params) => props.openForm(props.posts.find(post => post.id === params.id)),
          onLeave: props.resetForm
        }
      ]}
    />
  </ResourceContainer>

AnnouncementResource.propTypes = {
  posts: T.arrayOf(
    T.shape(AnnouncementTypes.propTypes)
  ).isRequired,
  formOpened: T.bool.isRequired,
  formPendingChanges: T.bool.isRequired,

  save: T.func.isRequired,
  openForm: T.func.isRequired,
  resetForm: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    posts: select.posts(state),
    formPendingChanges: select.formHasPendingChanges(state),
    formOpened: select.formIsOpened(state),
    formData: select.formData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openForm(announce) {
      dispatch(actions.openForm(announce))
    },
    resetForm() {
      dispatch(actions.resetForm())
    },
    save(announce) {
      if (announce.id) {
        dispatch(actions.updateAnnounce(announce))
      } else {
        dispatch(actions.createAnnounce(announce))
      }
    }
  }
}

const ConnectedAnnouncementResource = connect(mapStateToProps, mapDispatchToProps)(AnnouncementResource)

export {
  ConnectedAnnouncementResource as AnnouncementResource
}
