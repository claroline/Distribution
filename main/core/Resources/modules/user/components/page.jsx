import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {generateUrl} from '#/main/core/fos-js-router'
import {t} from '#/main/core/translation'

import {Router} from '#/main/core/router'
import {
  PageContainer,
  PageHeader,
  PageGroupActions,
  PageActions,
  PageAction,
  MoreAction,
  PageContent
} from '#/main/core/layout/page'

import {UserAvatar} from '#/main/core/layout/user/components/user-avatar.jsx'

import {ProfileShow} from '#/main/core/user/profile/components/show.jsx'
import {ProfileEdit} from '#/main/core/user/profile/components/edit.jsx'

// todo hide `contact` actions group on my profile

const UserPageHeader = props =>
  <header className={classes('page-header', props.className)}>
    <div className="page-header-picture">
      <UserAvatar
        className="img-thumbnail"
        picture={props.picture}
      />
    </div>
    <div className="page-header-content">
      <h1 className="page-title">
        {props.title}
        &nbsp;
        {props.subtitle && <small>{props.subtitle}</small>}
      </h1>

      {props.children}
    </div>
  </header>

UserPageHeader.propTypes = {
  picture: T.string
}

const UserPage = props => {
  const moreActions = [].concat(props.customActions, [
    {
      icon: 'fa fa-fw fa-lock',
      label: t('change_password'),
      group: t('user_management'),
      displayed: props.user.rights.current.edit,
      action: () => true
    }, {
      icon: 'fa fa-fw fa-trash-o',
      label: t('delete'),
      displayed: props.user.rights.current.delete,
      action: () => true,
      dangerous: true
    }
  ])

  return (
    <Router>
      <PageContainer className="user-page">
        <UserPageHeader
          picture={props.user.picture}
          title={props.user.name}
          subtitle={props.user.username}
        >
          <PageActions>
            <PageGroupActions>
              <PageAction
                id="profile-edit"
                title={t('edit_profile')}
                icon={'fa fa-pencil'}
                primary={true}
                action="#/edit"
              />
            </PageGroupActions>

            <PageGroupActions>
              <PageAction
                id="send-message"
                title={t('send_message')}
                icon={'fa fa-paper-plane-o'}
                action={() => true}
              />
              <PageAction
                id="add-contact"
                title={t('add_contact')}
                icon={'fa fa-address-book-o'}
                action={() => true}
              />
            </PageGroupActions>

            {0 !== moreActions.length &&
              <PageGroupActions>
                <MoreAction
                  id="resource-more"
                  actions={moreActions}
                />
              </PageGroupActions>
            }
          </PageActions>
        </UserPageHeader>

        <PageContent>
          {props.children}
        </PageContent>
      </PageContainer>
    </Router>
  )
}

UserPage.propTypes = {
  user: T.shape({
    name: T.string.isRequired,
    meta: T.shape({
      publicUrl: T.string.isRequired
    }).isRequired,
    rights: T.shape({
      current: T.shape({
        edit: T.bool.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  /**
   * Custom actions for the resources added by the UI.
   */
  customActions: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    label: T.string.isRequired,
    disabled: T.bool,
    displayed: T.bool,
    action: T.oneOfType([T.string, T.func]).isRequired,
    dangerous: T.bool,
    group: T.string
  })),
  children: T.element.isRequired
}

UserPage.defaultProps = {
  customActions: []
}

export {
  UserPage
}
