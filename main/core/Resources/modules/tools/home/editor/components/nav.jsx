import React from 'react'
import {connect} from 'react-redux'

import {NavLink} from '#/main/app/router'
import {trans} from '#/main/core/translation'
import {ModalButton} from '#/main/app/button'
import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'

import {select} from '#/main/core/tools/home/selectors'
import {actions} from '#/main/core/tools/home/editor/actions'

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
      required: true
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
const EditorNavComponent = props =>
  <nav className="tool-nav">
    {props.tabs.map((tab, tabIndex) =>
      <NavLink
        className="nav-tab"
        key={tabIndex}
        to={`/tab/${tab.title}`}
      >
        {tab.title}
      </NavLink>
    )}
    <ModalButton
      className="nav-add-tab"
      modal={[MODAL_DATA_FORM, {
        title: trans('add_tab'),
        sections: createTabForm,
        save: data => props.CreateTab(data)
      }]}
    >
      <span className="fa fa-plus" />
    </ModalButton>
  </nav>

const EditorNav = connect(
  (state) => ({
    tabs: select.tabs(state)
  }),
  dispatch => ({
    createTab(data){
      dispatch(actions.createTab(data))
    }
  })
)(EditorNavComponent)

export {
  EditorNav
}
