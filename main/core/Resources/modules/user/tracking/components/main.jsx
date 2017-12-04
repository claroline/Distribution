import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/fos-js-router'
import {t} from '#/main/core/translation'

import {UserPageContainer} from '#/main/core/user/containers/page.jsx'
import {UserDetails} from '#/main/core/user/components/details.jsx'
import {Timeline} from '#/main/core/user/tracking/components/timeline.jsx'

const TrackingComponent = props =>
  <UserPageContainer
    customActions={[
      {
        icon: 'fa fa-fw fa-id-card-o',
        label: t('show_profile'),
        action: generateUrl('claro_user_profile', {publicUrl: props.user.meta.publicUrl})
      }, {
        icon: 'fa fa-fw fa-file-pdf-o',
        label: t('export_tracking_pdf'),
        action: () => true
      }
    ]}
  >
    <div className="row">
      <div className="col-md-4">
        <UserDetails
          user={props.user}
        />
      </div>

      <div className="col-md-8">
        <h2>Suivi des activités</h2>

        {/* TODO add search */}

        <Timeline
          events={[
            {
              type: 'evaluation',
              status: 'success',
              resource: {
                id: '',
                icon: '',
                poster: '',
                name: 'This is the related resource'
              },
              workspaces: [

              ],
              data: {
                duration: 10000,
                attempts: 10,
              }
            }, {
              type: 'content',
              data: {
                duration: 10000,
                views: 15,
                progression: 50,
              }
            }, {
              type: 'content',
              data: {
                duration: 10000,
                views: 20
              }
            }, {
              type: 'badge',
              data: {

              }
            }
          ]}
        />
      </div>
    </div>
  </UserPageContainer>

TrackingComponent.propTypes = {
  user: T.shape({
    meta: T.shape({
      publicUrl: T.string.isRequired
    }).isRequired
  }).isRequired
}

const Tracking = connect(
  state => ({
    user: state.user
  }),
  dispatch => ({

  })
)(TrackingComponent)

export {
  Tracking
}
