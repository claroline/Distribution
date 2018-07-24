import React from 'react'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {connect} from 'react-redux'
import {actions} from '#/main/core/administration/user/group/actions'

import {MODAL_CONFIRM} from '#/main/app/modals/confirm'

import {trans, transChoice} from '#/main/core/translation'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

const GroupsList = props =>
  <DataListContainer
    name="groups.list"
    fetch={{
      url: ['apiv2_group_list_managed'],
      autoload: true
    }}
    primaryAction={GroupList.open}
    delete={{
      url: ['apiv2_group_delete_bulk']
    }}
    definition={GroupList.definition}
    card={GroupList.card}
    actions={(rows) => [
      {
        type: 'callback',
        icon: 'fa fa-fw fa-lock',
        label: trans('change_password'),
        scope: ['object'],
        callback: () => props.updatePassword(rows),
        dangerous: true
      }
    ]}
  />

GroupsList.propTypes = {
  updatePassword: T.func.isRequired
}


const Groups = connect(
  null,
  dispatch => ({
    updatePassword(groups) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          title: trans('group_password_reset'),
          question: trans('send_password_reset', {
            groups: groups.map(group => group.name).join(', ')
          }),
          handleConfirm: () => dispatch(actions.updatePassword(groups.map(group => group.id)))
        })
      )
    }
  })
)(GroupsList)

export {
  Groups
}
