import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {UserDetails} from '#/main/core/user/components/details.jsx'

const ProfileShowComponent = props =>
  <div className="user-profile row">
    <div className="col-md-3">
      <UserDetails
        user={props.user}
      />

      <ul className="user-profile-sections nav nav-pills nav-stacked">
        <li role="presentation" className="active">
          <a href="">Informations générales</a>
        </li>
        <li role="presentation">
          <a href="">Scolarité</a>
        </li>
        <li role="presentation">
          <a href="">
            <span className="fa fa-fw fa-comments" />
            Mur
          </a>
        </li>
        <li role="presentation">
          <a href="">
            <span className="fa fa-fw fa-trophy" />
            Badges
          </a>
        </li>
      </ul>
    </div>

    <div className="col-md-9">
      <h2>Informations générales</h2>
    </div>
  </div>

ProfileShowComponent.propTypes = {
  user: T.object.isRequired
}

const ProfileShow = connect(
  (state) => ({
    user: state.user
  }),
  (dispatch) => ({

  })
)(ProfileShowComponent)

export {
  ProfileShow
}
