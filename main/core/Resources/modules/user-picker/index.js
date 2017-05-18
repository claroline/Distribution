import React from 'react'
import invariant from 'invariant'
import {UserPickerModal} from '#/main/core/user-picker/components/modal.jsx'

export function openUserPicker(fading, fadeCallback = () => true, hideCallback = () => true) {

  const baseProps = {
    show: !fading,
    addCallback: () => addCallback(users),
    removeCallback:() => removeCallback(removes)
  }

  return React.createElement(UserPickerModal, baseProps)
}
