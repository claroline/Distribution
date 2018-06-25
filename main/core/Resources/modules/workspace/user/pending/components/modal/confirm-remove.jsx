import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {ConfirmModal} from '#/main/app/modals/confirm/components/confirm'

const MODAL_CONFIRM_REMOVE = 'MODAL_CONFIRM_REMOVE'

const ConfirmRemoveModal = props =>
  <ConfirmModal
    {...props}
    icon="fa fa-fw fa-check"
    title={trans('user_registration')}
    question={trans('workspace_user_remove_validation_message', {users: props.users.map(user => user.username).join(',')})}
    confirmButtonText={trans('remove')}
    handleConfirm={() => props.remove(props.users, props.workspace)}
  />

ConfirmRemoveModal.propTypes = {
  remove: T.func,
  users: T.array,
  workspace: T.object
}

export {
  MODAL_CONFIRM_REMOVE,
  ConfirmRemoveModal
}
