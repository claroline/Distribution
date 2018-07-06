import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {ToolPageContainer} from '#/main/core/tool/containers/page'
import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'
import {actions as formActions} from '#/main/core/data/form/actions'
import {
  PageHeader,
  PageContent,
  PageGroupActions,
  PageActions,
  PageAction
} from '#/main/core/layout/page'
import {WidgetGridEditor} from '#/main/core/widget/editor/components/grid'
import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'

import {ToolActions} from '#/main/core/tools/home/components/tool'
import {select} from '#/main/core/tools/home/selectors'
import {select as editorSelect} from '#/main/core/tools/home/editor/selectors'
import {EditorNav} from '#/main/core/tools/home/editor/components/nav'
import {tabFormSections} from '#/main/core/tools/home/utils'


const EditorComponent = props =>
  <ToolPageContainer>
    <EditorNav />
    <PageHeader
      title={props.currentTab ? props.currentTab.longTitle : ('desktop' === props.context.type ? trans('desktop') : props.context.data.name)}
    >
      <div className="tab-edition-container">
        <PageActions>
          <PageGroupActions>
            <PageAction
              type="modal"
              label={trans('configure', {}, 'actions')}
              icon="fa fa-fw fa-cog"
              modal={[MODAL_DATA_FORM, {
                title: trans('home_tab_edition'),
                sections: tabFormSections,
                data: props.currentTab,
                save: data => props.updateTab(props.tabs.length, data)
              }]}
            />
            <PageAction
              type="callback"
              label={trans('delete')}
              icon="fa fa-fw fa-trash-o"
              confirm={{
                title: trans('home_tab_delete_confirm_title'),
                message: trans('home_tab_delete_confirm_message')
              }}
              callback={() => props.deleteTab()}
            />
          </PageGroupActions>
        </PageActions>
        <ToolActions />
      </div>
    </PageHeader>
    <PageContent>
      <WidgetGridEditor
        context={props.context}
        widgets={props.widgets}
        update={(widgets) => props.update(props.currentTabIndex, widgets)}
      />
    </PageContent>
  </ToolPageContainer>

EditorComponent.propTypes = {
  context: T.object.isRequired,
  widgets: T.arrayOf(T.shape(
    WidgetContainerTypes.propTypes
  )).isRequired,
  update: T.func.isRequired
}

const Editor = connect(
  state => ({
    context: select.context(state),
    widgets: editorSelect.widgets(state),
    currentTabIndex: editorSelect.currentTabIndex(state),
    currentTab: editorSelect.currentTab(state)
  }),
  dispatch => ({
    update(currentTabIndex, widgets) {
      dispatch(formActions.updateProp('editor', `[${currentTabIndex}].widgets`, widgets))
    },
    deleteTab(tab) {
      console.log(tab)
    },
    updateTab(tabIndex, tab) {
      dispatch(formActions.updateProp('editor', `[${tabIndex}]`, tab))
    }
  })
)(EditorComponent)

export {
  Editor
}
