import React from 'react'

import {trans} from '#/main/core/translation'
import {ModalButton} from '#/main/app/button'
import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'

const createTabForm = [
  {
    title: trans('general'),
    primary: true,
    fields: [{
      name: 'title',
      type: 'string',
      label: trans('menu_title'),
      required: true
    }, {
      name: 'description',
      type: 'string',
      label: trans('title'),
      required: true,
      options: {
        long: true
      }
    }]
  },
  {
    icon: 'fa fa-fw fa-desktop',
    title: trans('display_parameters'),
    fields: [{
      name: 'icon',
      type: 'string',
      label: trans('icon')
    },
    {
      name: 'position',
      type: 'number',
      label: trans('position')
    },
    {
      name: 'poster',
      label: trans('poster'),
      type: 'file',
      options: {
        ratio: '3:1'
      }
    }]
  }
]
const EditorNav = props =>
  <div>
    <nav className="tool-nav">
      {props.tabs.map((tab, tabIndex) =>
        <a
          className="nav-tab"
          key={tabIndex}
          to={`/${tab.name}`}
        >
          {tab.name}
        </a>
      )}
      <ModalButton
        className="nav-add-tab"
        modal={[MODAL_DATA_FORM, {
          title: trans('add_tab'),
          sections: createTabForm,
          save: data => props.onSaveCreateTabForm(data)
        }]}
      >
        <span className="fa fa-plus" />
      </ModalButton>
    </nav>
    {/* {props.children} */}
  </div>

export {
  EditorNav
}
