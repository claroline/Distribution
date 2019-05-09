import React from 'react'

import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const LayoutToolbar = props =>
  <nav className="app-toolbar">
    <Button
      className="app-toolbar-link btn-link"
      type={CALLBACK_BUTTON}
      icon="fa fa-fw fa-comments"
      label="Messages"
      callback={() => true}
      tooltip="left"
    />

    <Button
      className="app-toolbar-link btn-link"
      type={CALLBACK_BUTTON}
      icon="fa fa-fw fa-calendar"
      label="Agenda"
      callback={() => true}
      tooltip="left"
    />

    <Button
      className="app-toolbar-link btn-link"
      type={CALLBACK_BUTTON}
      icon="fa fa-fw fa-tasks"
      label="Tâches"
      callback={() => true}
      tooltip="left"
    />
  </nav>

LayoutToolbar.propTypes = {

}

export {
  LayoutToolbar
}
