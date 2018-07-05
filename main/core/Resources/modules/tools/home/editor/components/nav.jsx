import React from 'react'
import {connect} from 'react-redux'
import merge from 'lodash/merge'

import {NavLink} from '#/main/app/router'
import {makeId} from '#/main/core/scaffolding/id'
import {trans} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {ModalButton} from '#/main/app/button'
import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'
import {actions as formActions} from '#/main/core/data/form/actions'

import {select as homeSelect} from '#/main/core/tools/home/selectors'
import {select as editorSelect} from '#/main/core/tools/home/editor/selectors'


const createTabForm = [
  {
    icon: 'fa fa-fw fa-plus',
    title: trans('general'),
    primary: true,
    fields: [{
      name: 'title',
      type: 'string',
      label: trans('menu_title'),
      required: true
    }, {
      name: 'longTitle',
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
        activeClassName="nav-tab-active"
        to={`/tab/${tab.id}`}
      >

        {tab.title}
      </NavLink>
    )}
    <ModalButton
      className="nav-add-tab"
      modal={[MODAL_DATA_FORM, {
        title: trans('add_tab'),
        sections: createTabForm,
        save: data => props.createTab(props.tabs.length, merge({}, data, {
          id: makeId(),
          title: data.title,
          longTitle: data.longTitle ? data.longTitle : data.title,
          icon: data.icon ? data.icon : null,
          poster: data.poster ? data.poster : null,
          type: props.context.type,
          user: props.context.type === 'desktop' ? currentUser() : null,
          workspace: props.context.type === 'workspace' ? {uuid: props.context.data.uuid} : null,
          position: data.position ? data.position : props.tabs.length + 1,
          widgets : data.widgets ? data.widgets : []
        }))
      }]}
    >
      <span className="fa fa-plus" />
    </ModalButton>
  </nav>



const EditorNav = connect(
  (state) => ({
    tabs: editorSelect.editorData(state),
    context : homeSelect.context(state)
  }),
  dispatch => ({
    createTab(tabIndex, tab){
      dispatch(formActions.updateProp('editor', `[${tabIndex}]`, tab))
    }
  })
)(EditorNavComponent)

export {
  EditorNav
}
