import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {selectors} from '#/main/core/modals/pickers/user/store'
import {UserList} from '#/main/core/administration/user/user/components/user-list'
import {User as UserType} from '#/main/core/user/prop-types'

const UsersPickerModal = props => {
  const selectAction = props.selectAction(props.selected)

  return (
    <Modal
      {...omit(props, 'confirmText', 'selected', 'selectAction', 'resetSelect')}
      className="users-picker-modal"
      icon="fa fa-fw fa-user"
      bsSize="lg"
      onExiting={() => props.resetSelect()}
    >
      <ListData
        name={selectors.STORE_NAME}
        fetch={{
          url: ['apiv2_users_picker_list'],
          autoload: true
        }}
        definition={[
          {
            name: 'username',
            type: 'username',
            label: trans('username'),
            displayed: true
          }, {
            name: 'lastName',
            type: 'string',
            label: trans('last_name'),
            displayed: true
          }, {
            name: 'firstName',
            type: 'string',
            label: trans('first_name'),
            displayed: true
          }, {
            name: 'email',
            type: 'email',
            label: trans('email'),
            displayed: true
          }
        ]}
        card={UserList.card}
        display={props.display}
      />

      <Button
        label={props.confirmText}
        {...selectAction}
        className="modal-btn btn"
        // type={CALLBACK_BUTTON}
        primary={true}
        disabled={0 === props.selected.length}
        onClick={props.fadeModal}
        // callback={() => {
        //   if (0 < props.selected.length) {
        //     props.fadeModal()
        //     props.handleSelect(props.selected)
        //   }
        // }}
      />
    </Modal>
  )
}

UsersPickerModal.propTypes = {
  title: T.string,
  confirmText: T.string,
  selectAction: T.func.isRequired,
  fadeModal: T.func.isRequired,
  selected: T.arrayOf(T.shape(UserType.propTypes)).isRequired,
  resetSelect: T.func.isRequired
}

UsersPickerModal.defaultProps = {
  title: trans('user_selector'),
  confirmText: trans('select', {}, 'actions'),
}

export {
  UsersPickerModal
}
