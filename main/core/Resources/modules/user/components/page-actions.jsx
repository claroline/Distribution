import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {
  PageGroupActions,
  PageActions,
  PageAction,
  MoreAction
} from '#/main/core/layout/page'

// todo hide `contact` actions group on my profile

const EditGroupActions = props =>
  <PageGroupActions>
    <PageAction
      id="profile-edit"
      title={t('edit_profile')}
      icon={'fa fa-pencil'}
      primary={true}
      action="#/edit"
    />

    <PageAction
      id="profile-edit-cancel"
      title={t('cancel')}
      icon={'fa fa-times'}
      action="#/show"
    />
  </PageGroupActions>

const UserPageActions = props => {
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
    <PageActions>
      {props.user.rights.current.edit &&
        <EditGroupActions />
      }

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
            id="user-more"
            actions={moreActions}
          />
        </PageGroupActions>
      }
    </PageActions>
  )
}

UserPageActions.propTypes = {
  user: T.shape({
    meta: T.shape({
      publicUrl: T.string.isRequired
    }).isRequired,
    rights: T.shape({
      current: T.shape({
        edit: T.bool.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  customActions: T.array
}

UserPageActions.defaultProps = {
  customActions: []
}

export {
  UserPageActions
}
