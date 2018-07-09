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
import {tabFormSections} from '#/main/core/tools/home/utils'
import {Tab as TabTypes} from '#/main/core/tools/home/prop-types'


const EditorNavComponent = props =>
  <nav className="tool-nav">
    {props.editorData.map((tab, tabIndex) =>
      <NavLink
        className="nav-tab"
        activeClassName="nav-tab-active"
        key={tabIndex}
        to={`/edit/tab/${tab.id}`}
      >
        {tab.icon &&
          <span className={`fa fa-${tab.icon} tab-icon`} />
        }
        {tab.title}
      </NavLink>
    )}
    <ModalButton
      className="nav-add-tab"
      modal={[MODAL_DATA_FORM, {
        title: trans('add_tab'),
        sections: tabFormSections,
        data: merge({}, TabTypes.defaultProps, {
          id: makeId(),
          position: props.editorData.length + 1,
          type: props.context.type,
          user: props.context.type === 'desktop' ? currentUser() : null,
          workspace: props.context.type === 'workspace' ? {uuid: props.context.data.uuid} : null
        }),
        save: data => props.createTab(props.editorData.length, data)
      }]}
    >
      <span className="fa fa-plus" />
    </ModalButton>
  </nav>


const EditorNav = connect(
  (state) => ({
    editorData: editorSelect.editorData(state),
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
