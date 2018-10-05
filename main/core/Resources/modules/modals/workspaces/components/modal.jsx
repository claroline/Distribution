import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {selectors} from '#/main/core/modals/users/store'
import {UserList} from '#/main/core/administration/user/user/components/user-list'
import {Workspace as WorkspaceType} from '#/main/core/workspace/prop-types'

const WorkspacesPickerModal = props => {
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
          url: ['apiv2_workspaces_picker_list'],
          autoload: true
        }}
        definition={[
          {
            name: 'name',
            type: 'string',
            label: trans('username'),
            displayed: true
          }, {
            name: 'code',
            type: 'string',
            label: trans('code'),
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
        primary={true}
        disabled={0 === props.selected.length}
        onClick={props.fadeModal}
      />
    </Modal>
  )
}

WorkspacesPickerModal.propTypes = {
  title: T.string,
  confirmText: T.string,
  selectAction: T.func.isRequired,
  fadeModal: T.func.isRequired,
  selected: T.arrayOf(T.shape(WorkspaceType.propTypes)).isRequired,
  resetSelect: T.func.isRequired
}

WorkspacesPickerModal.defaultProps = {
  title: trans('user_selector'),
  confirmText: trans('select', {}, 'actions')
}

export {
  WorkspacesPickerModal
}
